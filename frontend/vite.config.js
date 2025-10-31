import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    // ✅ SPA Fallback for React Router (prevents 404 on client routes like /admin/dashboard)
    historyApiFallback: true,

    // ✅ Proxy API requests in dev to your Node/Express backend
    proxy: {
      "/api": {
        target: "http://localhost:5000",   // your backend server address
        changeOrigin: true,                 // avoids CORS blocking
        secure: false,                      // allow self‑signed SSL in dev (ignored for http)
        // To strip "/api" prefix:
        // rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },

  // Optional: Build chunk warnings and manual chunk splitting
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      // Example: Create vendor chunk
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          vendor: ['axios', 'socket.io-client'], // add common libraries here
        },
      },
    },
  },

  // Optional: If deploying to Netlify/Vercel, set base path if not at root
  // base: "/",
});
 