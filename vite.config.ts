import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/react-utils-website/",
  plugins: [react()],
  envDir: "./src",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
