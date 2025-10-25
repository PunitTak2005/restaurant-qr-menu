import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // ✅ Enables SPA fallback (fixes 404 on nested routes like /admin/dashboard)
    historyApiFallback: true,

    // ✅ Proxy API requests to your Node/Express backend
    proxy: {
      "/api": {
        target: "http://localhost:5000",   // backend server port
        changeOrigin: true,                 // avoids CORS blocking
        secure: false,                      // allow self‑signed SSL
        // optional: remove '/api' prefix before passing to backend
        // rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
