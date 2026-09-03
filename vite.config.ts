import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { lunaValidationStubPlugin } from "./vite.luna-validation-stub";

function resolveApiBaseUrl(configured: string | undefined): string {
  const defaultBase = "/api";
  const value = configured?.trim() || defaultBase;

  if (!value.startsWith("http")) {
    return value;
  }

  try {
    const parsed = new URL(value);
    if (parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1") {
      return parsed.pathname.replace(/\/$/, "") || defaultBase;
    }
  } catch {
    return defaultBase;
  }

  return value;
}

const apiBaseUrl = resolveApiBaseUrl(process.env.VITE_API_BASE_URL);

const apiProxy = {
  "/api": {
    target: process.env.LUNA_VALIDATION_API_PROXY_TARGET || "http://localhost:3300",
    changeOrigin: true,
    secure: false,
  },
};

export default defineConfig({
  plugins: [lunaValidationStubPlugin(), react()],
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
});
