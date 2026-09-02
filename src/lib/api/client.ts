import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';
import {
  clearAuthStorage,
  getStoredToken,
} from '@/lib/auth/storage';

const baseURL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3300/api';

export const apiClient: AxiosInstance = axios.create({
  baseURL,
  timeout: 30000,
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
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      clearAuthStorage();
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/unauthorized';
      }
    }
    return Promise.reject(error);
  },
);

export async function apiRequest<T>(
  config: AxiosRequestConfig,
): Promise<T> {
  const response = await apiClient.request<T>(config);
  return response.data;
}

export { baseURL };
