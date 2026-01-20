// export default axiosInstance;
// src/helpers/HttpClient.js
import axios from "axios";
import { getCookie, setCookie, deleteCookie } from "cookies-next";

/* ========= Base URL ========= */
const RAW_BASE =
    import.meta.env.VITE_API_URL || "http://127.0.0.1:9000/api";
const BASE_URL = RAW_BASE.replace(/\/+$/, "");
const REFRESH_URL = `${BASE_URL}/token/refresh`;

/* ========= Storage Keys (alignés avec AuthContext) ========= */
export const KEY_AUTH_FLAG = "__GESTIO-MAIRIE_REACT_AUTH__";
export const KEY_ACCESS = "__GESTIO-MAIRIE_REACT_AUTH__TOKEN";
export const KEY_REFRESH = "__GESTIO-MAIRIE_REACT_AUTH__REFRESH";
export const KEY_USER = "__GESTIO-MAIRIE_REACT_AUTH__USER";

/* ========= Helpers lecture stockage ========= */
function safeReadLS(key) {
    try {
        const v = localStorage.getItem(key);
        return v ? JSON.parse(v) : undefined;
    } catch {
        return undefined;
    }
}

function safeReadCookie(key) {
    try {
        const v = getCookie(key);
        return v ? JSON.parse(v) : undefined;
    } catch {
        return undefined;
    }
}

function readAccessToken() {
    return safeReadLS(KEY_ACCESS) || safeReadCookie(KEY_ACCESS);
}

function readRefreshToken() {
    return safeReadLS(KEY_REFRESH) || safeReadCookie(KEY_REFRESH);
}

/* ========= Ecriture session (tokens uniquement) ========= */
export function writeSession({ access, refresh }) {
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

    window.dispatchEvent(
        new CustomEvent("auth:session", {
            detail: { access, refresh },
        })
    );
}

export function clearSessionAndRedirect() {
    try {
        localStorage.clear();
    } catch {}

    [KEY_AUTH_FLAG, KEY_ACCESS, KEY_REFRESH, KEY_USER, "isAuthenticated"].forEach(
        (k) => {
            try {
                localStorage.removeItem(k);
            } catch {}
        }
    );
    [KEY_AUTH_FLAG, KEY_ACCESS, KEY_REFRESH, KEY_USER].forEach((k) =>
        deleteCookie(k)
    );

    window.location.href = "/auth/login";
}

function isAuthUrl(url) {
    if (!url) return false;
    const u = url.toString();
    return (
        u.includes("/login") ||
        u.includes("/auth") ||
        u.includes("/token/refresh")
    );
}

/* ========= Axios instance ========= */
const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: { Accept: "application/json" },
    withCredentials: false,
});

/* ========= Request interceptor ========= */
axiosInstance.interceptors.request.use(
    (config) => {
        const token = readAccessToken();
        if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
        }

        const isFormData =
            typeof FormData !== "undefined" &&
            (config.data instanceof FormData ||
                config.headers["Content-Type"] === "multipart/form-data");

        if (isFormData) {
            if (config.headers["Content-Type"]) delete config.headers["Content-Type"];
        } else {
            config.headers = config.headers || {};
            if (!config.headers["Content-Type"]) {
                config.headers["Content-Type"] = "application/json";
            }
        }

        return config;
    },
    (error) => Promise.reject(error)
);

/* ========= Refresh orchestration ========= */
let isRefreshing = false;
let subscribers = [];

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

    const res = await axios.post(
        REFRESH_URL, { refresh_token }, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        }
    );

    const newAccess = res.data.token;
    const newRefresh = res.data.refresh_token || refresh_token;

    if (!newAccess) throw new Error("Refresh response missing access token");

    writeSession({ access: newAccess, refresh: newRefresh });
    return newAccess;
}

/* ========= Response interceptor ========= */
axiosInstance.interceptors.response.use(
    (response) => response, // on laisse la réponse brute, wrapper gère le .data
    async(error) => {
        const resp = error.response;
        const original = error.config;

        if (!resp || !original) {
            return Promise.reject(error);
        }

        if (resp.status !== 401 || isAuthUrl(original.url)) {
            return Promise.reject(error);
        }

        if (original._retry) {
            return Promise.reject(error);
        }
        original._retry = true;

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
            onRefreshed(null);
            clearSessionAndRedirect();
            return Promise.reject(e);
        }
    }
);

/* ========= Wrapper pratique ========= */
export const HttpClient = {
    get: (url, config) => axiosInstance.get(url, config).then((r) => r.data),
    post: (url, data, config) =>
        axiosInstance.post(url, data, config).then((r) => r.data),
    put: (url, data, config) =>
        axiosInstance.put(url, data, config).then((r) => r.data),
    patch: (url, data, config) =>
        axiosInstance.patch(url, data, config).then((r) => r.data),
    delete: (url, config) =>
        axiosInstance.delete(url, config).then((r) => r.data),
};

export default axiosInstance;