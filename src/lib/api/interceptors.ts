import type { InternalAxiosRequestConfig } from 'axios';
import { apiClient } from './client';
import { getAuthToken, clearAuthStorage } from '@/lib/auth/auth-storage';

export function setupApiInterceptors(): void {
  apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        const hadAuthHeader = Boolean(error.config?.headers?.Authorization);
        if (hadAuthHeader) {
          clearAuthStorage();
        }
      }
      return Promise.reject(error);
    },
  );
}
