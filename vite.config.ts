import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  const validationEmail =
    env.VITE_LUNA_VALIDATION_EMAIL?.trim() || env.LUNA_VALIDATION_EMAIL?.trim() || '';
  const validationPassword =
    env.VITE_LUNA_VALIDATION_PASSWORD || env.LUNA_VALIDATION_PASSWORD || '';

  return {
    plugins: [react()],
    define: {
      'import.meta.env.VITE_LUNA_VALIDATION_EMAIL': JSON.stringify(validationEmail),
      'import.meta.env.VITE_LUNA_VALIDATION_PASSWORD': JSON.stringify(validationPassword),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      proxy: {
        '/api': {
          target: process.env.LUNA_VALIDATION_API_PROXY_TARGET || 'http://localhost:3300',
          changeOrigin: true,
          secure: false,
        },
      },
      port: 3033,
    },
    preview: {
      port: 3033,
    },
  };
});
