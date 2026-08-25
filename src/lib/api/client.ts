import axios from 'axios';
import { clearAuth, getStoredToken } from '@/lib/auth/session';
import { paths } from '@/routes/paths';

function resolveBaseUrl(): string {
  const configured =
    import.meta.env.VITE_API_BASE_URL ?? import.meta.env.VITE_API_URL;
  return (configured && configured.trim()) || 'http://localhost:3033/api';
}

export const apiClient = axios.create({
  baseURL: resolveBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      clearAuth();
      if (window.location.pathname !== paths.login) {
        window.location.assign(paths.login);
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;
