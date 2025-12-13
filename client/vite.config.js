// client/vite.config.js (ОНОВЛЕНИЙ ПОВНИЙ КОД)

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// Потрібно для створення правильного шляху до React
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  resolve: {
    alias: {
      // Примушуємо всі імпорти 'react' та 'react-dom' вказувати на одну і ту ж папку
      react: path.resolve("./node_modules/react"),
      "react-dom": path.resolve("./node_modules/react-dom"),
    },
  },
});
