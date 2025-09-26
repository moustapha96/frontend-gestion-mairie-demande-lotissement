// vite.config.js
import { defineConfig } from "file:///C:/Users/User/Documents/projet-mairie/CODE/front-gestion-mairie/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/User/Documents/projet-mairie/CODE/front-gestion-mairie/node_modules/@vitejs/plugin-react/dist/index.mjs";
import path from "path";
import tailwind from "file:///C:/Users/User/Documents/projet-mairie/CODE/front-gestion-mairie/node_modules/tailwindcss/lib/index.js";
import { VitePWA } from "file:///C:/Users/User/Documents/projet-mairie/CODE/front-gestion-mairie/node_modules/vite-plugin-pwa/dist/index.js";
var __vite_injected_original_dirname = "C:\\Users\\User\\Documents\\projet-mairie\\CODE\\front-gestion-mairie";
var pwaConfig = {
  registerType: "autoUpdate",
  includeAssets: ["logo-color.svg"],
  workbox: {
    globPatterns: ["**/*.{js,css,html,png,jpg,gif,svg,jpeg}"],
    navigateFallback: "/",
    navigateFallbackAllowlist: [/^(?!\/__).*/],
    runtimeCaching: [
      {
        urlPattern: /\.(png|jpg|gif|svg)$/,
        handler: "StaleWhileRevalidate"
      }
    ],
    maximumFileSizeToCacheInBytes: 10 * 1024 * 1024
  },
  manifest: {
    name: "gestion-mairie",
    short_name: "gestion-mairie",
    description: "Gestion de la Mairie de Kaolack",
    start_url: "/",
    display: "standalone",
    background_color: "#e28743",
    theme_color: "#eab676",
    icons: [
      {
        src: "/logo_150X150.png",
        sizes: "192x192",
        purpose: "any maskable"
      },
      {
        src: "/logo_150X150.png",
        sizes: "512x512",
        purpose: "maskable any"
      }
    ]
  }
};
var vite_config_default = defineConfig({
  basename: "/",
  // plugins: [react()],
  plugins: [react(), VitePWA(pwaConfig), tailwind()],
  define: { "process.env": {} },
  build: {
    outDir: "../deploy-gestion-mairie/",
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"]
        }
      }
    },
    chunkSizeWarningLimit: 1e3
    // 1 MB
  },
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "src")
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxVc2VyXFxcXERvY3VtZW50c1xcXFxwcm9qZXQtbWFpcmllXFxcXENPREVcXFxcZnJvbnQtZ2VzdGlvbi1tYWlyaWVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXFVzZXJcXFxcRG9jdW1lbnRzXFxcXHByb2pldC1tYWlyaWVcXFxcQ09ERVxcXFxmcm9udC1nZXN0aW9uLW1haXJpZVxcXFx2aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvVXNlci9Eb2N1bWVudHMvcHJvamV0LW1haXJpZS9DT0RFL2Zyb250LWdlc3Rpb24tbWFpcmllL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCByZWFjdCBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3RcIjtcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgdGFpbHdpbmQgZnJvbSBcInRhaWx3aW5kY3NzXCI7XG5cbmltcG9ydCB7IFZpdGVQV0EgfSBmcm9tIFwidml0ZS1wbHVnaW4tcHdhXCI7XG5cblxuY29uc3QgcHdhQ29uZmlnID0ge1xuICByZWdpc3RlclR5cGU6IFwiYXV0b1VwZGF0ZVwiLFxuICBpbmNsdWRlQXNzZXRzOiBbXCJsb2dvLWNvbG9yLnN2Z1wiXSxcbiAgd29ya2JveDoge1xuICAgIGdsb2JQYXR0ZXJuczogW1wiKiovKi57anMsY3NzLGh0bWwscG5nLGpwZyxnaWYsc3ZnLGpwZWd9XCJdLCBcbiAgICBuYXZpZ2F0ZUZhbGxiYWNrOiBcIi9cIiwgXG4gICAgbmF2aWdhdGVGYWxsYmFja0FsbG93bGlzdDogWy9eKD8hXFwvX18pLiovXSwgXG4gICAgcnVudGltZUNhY2hpbmc6IFtcbiAgICAgIHtcbiAgICAgICAgdXJsUGF0dGVybjogL1xcLihwbmd8anBnfGdpZnxzdmcpJC8sXG4gICAgICAgIGhhbmRsZXI6IFwiU3RhbGVXaGlsZVJldmFsaWRhdGVcIixcbiAgICAgIH0sXG4gICAgXSxcbiAgICBtYXhpbXVtRmlsZVNpemVUb0NhY2hlSW5CeXRlczogMTAgKiAxMDI0ICogMTAyNCwgXG4gIH0sXG4gIG1hbmlmZXN0OiB7XG4gICAgbmFtZTogXCJnZXN0aW9uLW1haXJpZVwiLFxuICAgIHNob3J0X25hbWU6IFwiZ2VzdGlvbi1tYWlyaWVcIixcbiAgICBkZXNjcmlwdGlvbjogXCJHZXN0aW9uIGRlIGxhIE1haXJpZSBkZSBLYW9sYWNrXCIsXG4gICAgc3RhcnRfdXJsOiBcIi9cIixcbiAgICBkaXNwbGF5OiBcInN0YW5kYWxvbmVcIixcbiAgICBiYWNrZ3JvdW5kX2NvbG9yOiBcIiNlMjg3NDNcIixcbiAgICB0aGVtZV9jb2xvcjogXCIjZWFiNjc2XCIsXG4gICAgaWNvbnM6IFtcbiAgICAgIHtcbiAgICAgICAgc3JjOiBcIi9sb2dvXzE1MFgxNTAucG5nXCIsXG4gICAgICAgIHNpemVzOiBcIjE5MngxOTJcIixcbiAgICAgICAgcHVycG9zZTogXCJhbnkgbWFza2FibGVcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHNyYzogXCIvbG9nb18xNTBYMTUwLnBuZ1wiLFxuICAgICAgICBzaXplczogXCI1MTJ4NTEyXCIsXG4gICAgICAgIHB1cnBvc2U6IFwibWFza2FibGUgYW55XCIsXG4gICAgICB9LFxuICAgIF0sXG4gIH0sXG59O1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgYmFzZW5hbWU6IFwiL1wiLFxuICAvLyBwbHVnaW5zOiBbcmVhY3QoKV0sXG4gIHBsdWdpbnM6IFtyZWFjdCgpLCBWaXRlUFdBKHB3YUNvbmZpZyksIHRhaWx3aW5kKCldLFxuICBkZWZpbmU6IHsgXCJwcm9jZXNzLmVudlwiOiB7fSB9LFxuICAgYnVpbGQ6IHtcbiAgICBvdXREaXI6IFwiLi4vZGVwbG95LWdlc3Rpb24tbWFpcmllL1wiLFxuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIG91dHB1dDoge1xuICAgICAgICBtYW51YWxDaHVua3M6IHtcbiAgICAgICAgICB2ZW5kb3I6IFtcInJlYWN0XCIsIFwicmVhY3QtZG9tXCIsIFwicmVhY3Qtcm91dGVyLWRvbVwiXSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICBjaHVua1NpemVXYXJuaW5nTGltaXQ6IDEwMDAsIC8vIDEgTUJcbiAgfSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICBcIkBcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCJzcmNcIiksXG4gICAgfSxcbiAgfSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE2WCxTQUFTLG9CQUFvQjtBQUMxWixPQUFPLFdBQVc7QUFDbEIsT0FBTyxVQUFVO0FBQ2pCLE9BQU8sY0FBYztBQUVyQixTQUFTLGVBQWU7QUFMeEIsSUFBTSxtQ0FBbUM7QUFRekMsSUFBTSxZQUFZO0FBQUEsRUFDaEIsY0FBYztBQUFBLEVBQ2QsZUFBZSxDQUFDLGdCQUFnQjtBQUFBLEVBQ2hDLFNBQVM7QUFBQSxJQUNQLGNBQWMsQ0FBQyx5Q0FBeUM7QUFBQSxJQUN4RCxrQkFBa0I7QUFBQSxJQUNsQiwyQkFBMkIsQ0FBQyxhQUFhO0FBQUEsSUFDekMsZ0JBQWdCO0FBQUEsTUFDZDtBQUFBLFFBQ0UsWUFBWTtBQUFBLFFBQ1osU0FBUztBQUFBLE1BQ1g7QUFBQSxJQUNGO0FBQUEsSUFDQSwrQkFBK0IsS0FBSyxPQUFPO0FBQUEsRUFDN0M7QUFBQSxFQUNBLFVBQVU7QUFBQSxJQUNSLE1BQU07QUFBQSxJQUNOLFlBQVk7QUFBQSxJQUNaLGFBQWE7QUFBQSxJQUNiLFdBQVc7QUFBQSxJQUNYLFNBQVM7QUFBQSxJQUNULGtCQUFrQjtBQUFBLElBQ2xCLGFBQWE7QUFBQSxJQUNiLE9BQU87QUFBQSxNQUNMO0FBQUEsUUFDRSxLQUFLO0FBQUEsUUFDTCxPQUFPO0FBQUEsUUFDUCxTQUFTO0FBQUEsTUFDWDtBQUFBLE1BQ0E7QUFBQSxRQUNFLEtBQUs7QUFBQSxRQUNMLE9BQU87QUFBQSxRQUNQLFNBQVM7QUFBQSxNQUNYO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRjtBQUdBLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFVBQVU7QUFBQTtBQUFBLEVBRVYsU0FBUyxDQUFDLE1BQU0sR0FBRyxRQUFRLFNBQVMsR0FBRyxTQUFTLENBQUM7QUFBQSxFQUNqRCxRQUFRLEVBQUUsZUFBZSxDQUFDLEVBQUU7QUFBQSxFQUMzQixPQUFPO0FBQUEsSUFDTixRQUFRO0FBQUEsSUFDUixlQUFlO0FBQUEsTUFDYixRQUFRO0FBQUEsUUFDTixjQUFjO0FBQUEsVUFDWixRQUFRLENBQUMsU0FBUyxhQUFhLGtCQUFrQjtBQUFBLFFBQ25EO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxJQUNBLHVCQUF1QjtBQUFBO0FBQUEsRUFDekI7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssS0FBSyxRQUFRLGtDQUFXLEtBQUs7QUFBQSxJQUNwQztBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
