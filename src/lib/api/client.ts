import axios from 'axios';
import { getToken, clearAuthStorage } from '@/lib/auth/storage';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3300/api').replace(
  /\/$/,
  '',
);

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Maps a locked contract path (e.g. `/api/super-admin/dashboard`) onto the configured
 * baseURL without duplicating `/api` when baseURL already ends with `/api`.
 */
export function resolveApiPath(contractPath: string): string {
  if (API_BASE_URL.endsWith('/api') && contractPath.startsWith('/api/')) {
    return contractPath.slice('/api'.length);
  }
  return contractPath;
}

apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      clearAuthStorage();
      window.dispatchEvent(new CustomEvent('auth:logout'));
    }
    return Promise.reject(error);
  },
);
