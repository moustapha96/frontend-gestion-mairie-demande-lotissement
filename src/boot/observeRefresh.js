// par ex. src/boot/observeRefresh.js
export function observeAuthRefresh(cb) {
    function handler(e) {
        const { access, refresh } = e.detail || {};
        cb({ access, refresh, at: new Date() });
    }
    window.addEventListener("auth:session", handler);
    return () => window.removeEventListener("auth:session", handler);
}