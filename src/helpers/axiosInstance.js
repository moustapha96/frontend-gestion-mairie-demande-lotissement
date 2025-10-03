// import axios from "axios";
// import { deleteCookie, getCookie } from "cookies-next";

// // Créer une instance d'Axios
// const axiosInstance = axios.create({
//     // baseURL: 'http://localhost:8000/api',
//     baseURL: "https://backendgl.kaolackcommune.sn/api",
//     headers: {
//         'Content-Type': 'application/json',
//         'Accept': 'application/json'
//     }
// });



// axiosInstance.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         if (error.response ? .status === 401) {
//             window.location.href = '/auth/login';
//             localStorage.removeItem('token');
//             localStorage.removeItem('user');
//             localStorage.removeItem('__GESTIO-MAIRIE_REACT_AUTH__TOKEN')
//             localStorage.removeItem('__GESTIO-MAIRIE_REACT_AUTH__USER')
//             localStorage.removeItem('__GESTIO-MAIRIE_REACT_AVATAR')
//             localStorage.removeItem('__GESTIO-MAIRIE_REACT_AUTH__')
//             localStorage.clear()
//             deleteCookie('__GESTIO-MAIRIE_REACT_AUTH__TOKEN')
//             deleteCookie('__GESTIO-MAIRIE_REACT_AUTH__USER')
//             deleteCookie('__GESTIO-MAIRIE_REACT_AVATAR')
//             deleteCookie('__GESTIO-MAIRIE_REACT_AUTH__')
//         }
//         return Promise.reject(error);
//     }
// );

// axiosInstance.interceptors.request.use(
//     (config) => {
//         const token = JSON.parse(getCookie('__GESTIO-MAIRIE_REACT_AUTH__TOKEN'));
//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`;
//         } else {
//             config.headers = {
//                 Authorization: 'No Authorization'
//             };
//         }

//         // if (['post', 'put', 'patch'].includes(config.method)) {
//         //   config.headers['Content-Type'] = 'application/json';
//         // }

//         // if (['post', 'put', 'patch'].includes(config.method)) {
//         //   if (!config.headers['Content-Type']) {
//         //     config.headers['Content-Type'] = 'application/json';
//         //   }
//         // }


//         // config.headers['Accept'] = 'application/json';

//         return config;
//     },
//     (error) => Promise.reject(error)
// );

// export default axiosInstance;
import axios from "axios";
import { getCookie, setCookie, deleteCookie } from "cookies-next";

/* ========= Base URL ========= */
const RAW_BASE =
    import.meta.env ? .VITE_API_URL || "http://localhost:8000/api";
const BASE_URL = RAW_BASE.replace(/\/+$/, ""); // strip trailing slash
const REFRESH_URL = `${BASE_URL}/token/refresh`;

/* ========= Storage Keys (mêmes que ton AuthContext) ========= */
const KEY_AUTH_FLAG = "__GESTIO-MAIRIE_REACT_AUTH__";
const KEY_ACCESS = "__GESTIO-MAIRIE_REACT_AUTH__TOKEN";
const KEY_REFRESH = "__GESTIO-MAIRIE_REACT_AUTH__REFRESH";
const KEY_USER = "__GESTIO-MAIRIE_REACT_AUTH__USER";

/* ========= Helpers ========= */
function safeReadLS(key) {
    try {
        const v = localStorage.getItem(key);
        return v ? JSON.parse(v) : undefined;
    } catch { return undefined; }
}

function safeReadCookie(key) {
    try {
        const v = getCookie(key);
        return v ? JSON.parse(v) : undefined;
    } catch { return undefined; }
}

function readAccessToken() {
    return safeReadLS(KEY_ACCESS) ? ? safeReadCookie(KEY_ACCESS);
}

function readRefreshToken() {
    return safeReadLS(KEY_REFRESH) ? ? safeReadCookie(KEY_REFRESH);
}

function writeSession({ access, refresh }) {
    if (access) {
        localStorage.setItem(KEY_ACCESS, JSON.stringify(access));
        setCookie(KEY_ACCESS, JSON.stringify(access));
    }
    if (refresh) {
        localStorage.setItem(KEY_REFRESH, JSON.stringify(refresh));
        setCookie(KEY_REFRESH, JSON.stringify(refresh));
    }
    localStorage.setItem(KEY_AUTH_FLAG, "true");
    setCookie(KEY_AUTH_FLAG, "true");
}

function clearSessionAndRedirect() {
    try { localStorage.clear(); } catch {}
    [KEY_AUTH_FLAG, KEY_ACCESS, KEY_REFRESH, KEY_USER, "isAuthenticated"].forEach(k => {
        try { localStorage.removeItem(k); } catch {}
    });
    [KEY_AUTH_FLAG, KEY_ACCESS, KEY_REFRESH, KEY_USER].forEach(k => deleteCookie(k));
    window.location.href = "/auth/login";
}

/* ========= Axios instance ========= */
const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        Accept: "application/json",
        // NE PAS fixer Content-Type ici pour laisser FormData fonctionner
    },
    withCredentials: false,
});

/* ========= Request interceptor ========= */
axiosInstance.interceptors.request.use(
    (config) => {
        // Token
        const token = readAccessToken();
        if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Si FormData, supprimer Content-Type pour laisser le browser définir le boundary
        const isFormData =
            typeof FormData !== "undefined" &&
            (config.data instanceof FormData || config.headers ? .["Content-Type"] === "multipart/form-data");

        if (isFormData) {
            if (config.headers && config.headers["Content-Type"]) {
                delete config.headers["Content-Type"];
            }
        } else {
            // Sinon JSON par défaut si non précisé
            if (!config.headers || !config.headers["Content-Type"]) {
                config.headers = config.headers || {};
                config.headers["Content-Type"] = "application/json";
            }
        }

        return config;
    },
    (error) => Promise.reject(error)
);

/* ========= Response interceptor (refresh auto) ========= */
let isRefreshing = false;
let subscribers = []; // callbacks pour rejouer après refresh

function subscribeTokenRefresh(cb) {
    subscribers.push(cb);
}

function onRefreshed(newToken) {
    subscribers.forEach((cb) => cb(newToken));
    subscribers = [];
}

async function doRefresh() {
    const refresh_token = readRefreshToken();
    if (!refresh_token) throw new Error("No refresh token");

    // Utiliser axios "nu" pour ne pas repasser par les interceptors
    const res = await axios.post(
        REFRESH_URL, { refresh_token }, { headers: { "Content-Type": "application/json", Accept: "application/json" } }
    );

    const newAccess = res ? .data ? .token;
    const newRefresh = res ? .data ? .refresh_token ? ? refresh_token;
    if (!newAccess) throw new Error("Refresh response missing access token");

    writeSession({ access: newAccess, refresh: newRefresh });
    return newAccess;
}

axiosInstance.interceptors.response.use(
    (response) => response,
    async(error) => {
        const status = error ? .response ? .status;
        const original = error ? .config;

        // Pas de retry si autre qu'un 401 ou si config absente
        if (status !== 401 || !original) {
            return Promise.reject(error);
        }

        // Éviter boucle infinie
        if (original._retry) {
            return Promise.reject(error);
        }
        original._retry = true;

        // Si refresh déjà en cours, on met en attente
        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                subscribeTokenRefresh((newToken) => {
                    if (!newToken) return reject(error);
                    original.headers = original.headers || {};
                    original.headers.Authorization = `Bearer ${newToken}`;
                    resolve(axiosInstance(original));
                });
            });
        }

        // Lancer un refresh
        isRefreshing = true;
        try {
            const newToken = await doRefresh();
            isRefreshing = false;
            onRefreshed(newToken);

            original.headers = original.headers || {};
            original.headers.Authorization = `Bearer ${newToken}`;
            return axiosInstance(original);
        } catch (e) {
            isRefreshing = false;
            onRefreshed(null); // réveille les subscribers en échec
            clearSessionAndRedirect();
            return Promise.reject(e);
        }
    }
);

export default axiosInstance;