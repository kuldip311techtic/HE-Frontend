import axios, { type AxiosInstance } from 'axios';
import { getToken, clearAuthStorage } from '@/lib/auth/storage';

export function registerApiInterceptors(client: AxiosInstance): void {
  client.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        clearAuthStorage();
        window.dispatchEvent(new CustomEvent('auth:logout'));
        if (!window.location.pathname.startsWith('/admin/login')) {
          window.location.assign('/admin/login');
        }
      }
      return Promise.reject(error);
    },
  );
}
