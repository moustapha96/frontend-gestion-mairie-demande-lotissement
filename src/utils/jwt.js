// src/utils/jwt.js
export function parseJwt(token) {
    try {
        const [, payload] = token.split(".");
        const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
        return JSON.parse(decodeURIComponent(escape(json)));
    } catch {
        return null;
    }
}

export function getJwtExpiry(token) {
    const p = parseJwt(token);
    return p.exp ? p.exp * 1000 : null; // ms
}

export function msUntilExpiry(token, safetyMs = 60000) {
    const expMs = getJwtExpiry(token);
    if (!expMs) return null;
    return Math.max(0, expMs - Date.now() - safetyMs);
}