import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwind from "tailwindcss";

// https://vitejs.dev/config/
export default defineConfig({
    basename: "/",
    // plugins: [react()],
    plugins: [react(), tailwind()],
    define: { "process.env": {} },
    build: {
        outDir: "../deploy-mairie/",
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ["react", "react-dom", "react-router-dom"],
                },
            },
        },
        chunkSizeWarningLimit: 1000, // 1 MB
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src"),
        },
    },
    server: {
        port: 3000,
        open: true,
        headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
            "Pragma": "no-cache",
            "Expires": "0",
        },
    },
    preview: {
        headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
            "Pragma": "no-cache",
            "Expires": "0",
        },
    },
});