import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
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
    port: 5173,
  },
});
