import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwind from "tailwindcss";

import { VitePWA } from "vite-plugin-pwa";


const pwaConfig = {
    registerType: "autoUpdate",
    includeAssets: ["logo-color.svg"],
    workbox: {
        globPatterns: ["**/*.{js,css,html,png,jpg,gif,svg,jpeg}"],
        navigateFallback: "/",
        navigateFallbackAllowlist: [/^(?!\/__).*/],
        runtimeCaching: [{
            urlPattern: /\.(png|jpg|gif|svg)$/,
            handler: "StaleWhileRevalidate",
        }, ],
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
    },
    manifest: {
        name: "gestion-mairie",
        short_name: "gestion-mairie",
        description: "Gestion de la Mairie de Kaolack",
        start_url: "/",
        display: "standalone",
        background_color: "#e28743",
        theme_color: "#eab676",
        icons: [{
                src: "/logo_150X150.png",
                sizes: "192x192",
                purpose: "any maskable",
            },
            {
                src: "/logo_150X150.png",
                sizes: "512x512",
                purpose: "maskable any",
            },
        ],
    },
};

// https://vitejs.dev/config/
export default defineConfig({
    basename: "/",
    // plugins: [react()],
    plugins: [react(), VitePWA(pwaConfig), tailwind()],
    define: { "process.env": {} },
    build: {
        outDir: "../deploy-gestion-mairie/",
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
    },
});