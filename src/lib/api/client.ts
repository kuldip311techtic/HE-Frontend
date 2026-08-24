import axios from 'axios';
import { AUTH_TOKEN_STORAGE_KEY, clearAuth } from '../auth/session';

export {
  AUTH_EMAIL_STORAGE_KEY,
  AUTH_TOKEN_STORAGE_KEY,
  AUTH_TOKEN_TYPE_STORAGE_KEY,
} from '../auth/session';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      const requestUrl = error.config?.url ?? '';

      if (!requestUrl.includes('/login')) {
        clearAuth();

        if (window.location.pathname !== '/admin/login') {
          window.location.assign('/admin/login');
        }
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
