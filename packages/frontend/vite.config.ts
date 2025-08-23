import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [tanstackRouter(), tailwindcss(), react()],
  resolve: {
    alias: {
      "@": "/src",
      "@/app": "/src/app",
      "@/pages": "/src/pages",
      "@/shared": "/src/shared",
    },
  },
});
