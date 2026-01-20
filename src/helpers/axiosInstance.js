// export default axiosInstance;
// src/helpers/HttpClient.js
import axios from "axios";
import { getCookie, setCookie, deleteCookie } from "cookies-next";

/* ========= Base URL ========= */
const RAW_BASE =
    import.meta.env.VITE_API_URL || "http://localhost:8000/api";
const BASE_URL = RAW_BASE.replace(/\/+$/, "");

/* ========= Storage Keys (alignés avec AuthContext) ========= */
export const KEY_AUTH_FLAG = "__GESTIO-MAIRIE_REACT_AUTH__";
export const KEY_ACCESS = "__GESTIO-MAIRIE_REACT_AUTH__TOKEN";
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

/* ========= Ecriture session (access token uniquement) ========= */
export function writeSession({ access }) {
    if (access) {
        localStorage.setItem(KEY_ACCESS, JSON.stringify(access));
        setCookie(KEY_ACCESS, JSON.stringify(access));
    }
    localStorage.setItem(KEY_AUTH_FLAG, "true");
    setCookie(KEY_AUTH_FLAG, "true");

    window.dispatchEvent(
        new CustomEvent("auth:session", {
            detail: { access },
        })
    );
}

export function clearSessionAndRedirect() {
    try {
        localStorage.clear();
    } catch {}

    [KEY_AUTH_FLAG, KEY_ACCESS, KEY_USER, "isAuthenticated"].forEach(
        (k) => {
            try {
                localStorage.removeItem(k);
            } catch {}
        }
    );
    [KEY_AUTH_FLAG, KEY_ACCESS, KEY_USER].forEach((k) =>
        deleteCookie(k)
    );

    window.location.href = "/auth/login";
}

function isAuthUrl(url) {
    if (!url) return false;
    const u = url.toString();
    return (
        u.includes("/login") ||
        u.includes("/auth")
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

/* ========= Response interceptor (sans refresh token) ========= */
axiosInstance.interceptors.response.use(
    (response) => response,
    async(error) => {
        const resp = error.response;
        const original = error.config;

        if (!resp || !original) {
            return Promise.reject(error);
        }

        if (resp.status === 401 && !isAuthUrl(original.url)) {
            clearSessionAndRedirect();
        }

        return Promise.reject(error);
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