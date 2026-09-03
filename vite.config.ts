import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  const validationEnv = {
    VITE_LUNA_VALIDATION_EMAIL:
      env.VITE_LUNA_VALIDATION_EMAIL || process.env.LUNA_VALIDATION_EMAIL || '',
    VITE_LUNA_VALIDATION_PASSWORD:
      env.VITE_LUNA_VALIDATION_PASSWORD || process.env.LUNA_VALIDATION_PASSWORD || '',
    VITE_LUNA_VALIDATION_ACCESS_TOKEN:
      env.VITE_LUNA_VALIDATION_ACCESS_TOKEN || process.env.LUNA_VALIDATION_ACCESS_TOKEN || '',
  };

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    define: {
      'import.meta.env.VITE_LUNA_VALIDATION_EMAIL': JSON.stringify(
        validationEnv.VITE_LUNA_VALIDATION_EMAIL,
      ),
      'import.meta.env.VITE_LUNA_VALIDATION_PASSWORD': JSON.stringify(
        validationEnv.VITE_LUNA_VALIDATION_PASSWORD,
      ),
      'import.meta.env.VITE_LUNA_VALIDATION_ACCESS_TOKEN': JSON.stringify(
        validationEnv.VITE_LUNA_VALIDATION_ACCESS_TOKEN,
      ),
    },
    server: {
      proxy: {
        '/api': {
          target: process.env.LUNA_VALIDATION_API_PROXY_TARGET || 'http://localhost:3300',
          changeOrigin: true,
          secure: false,
        },
      },
      port: 5173,
    },
  };
});
