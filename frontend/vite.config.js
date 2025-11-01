import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// [https://vite.dev/config/](https://vite.dev/config/)
export default defineConfig({
  plugins: [react()],

  // Remove development-only proxy for production!
  // server: {
  //   proxy: {
  //     "/api": {
  //       target: "http://localhost:5000", // Only for dev!
  //       changeOrigin: true,
  //       secure: false,
  //     },
  //   },
  // },

  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          vendor: ['axios'], // Remove 'socket.io-client' if unused!
        },
      },
    },
  },

  // base: "/", // Set base path if your frontend is deployed on a sub-path
});
