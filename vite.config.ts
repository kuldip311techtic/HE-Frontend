import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import { resolveApiBaseUrl } from "./src/lib/api/resolve-base-url";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiBaseUrl = resolveApiBaseUrl(
    env.VITE_API_BASE_URL || process.env.VITE_API_BASE_URL,
  );

  const apiProxy = {
    "/api": {
      target:
        process.env.LUNA_VALIDATION_API_PROXY_TARGET || "http://localhost:3300",
      changeOrigin: true,
      secure: false,
    },
  };

  return {
    plugins: [react()],
    define: {
      "import.meta.env.VITE_API_BASE_URL": JSON.stringify(apiBaseUrl),
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      host: true,
      port: 3033,
      proxy: apiProxy,
    },
    preview: {
      host: true,
      proxy: apiProxy,
    },
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./tests/setup.ts",
    },
  };
});
