import type { InternalAxiosRequestConfig } from 'axios';
import { apiClient } from './client';
import { getAuthToken, clearAuthStorage } from '@/lib/auth/auth-storage';

const PUBLIC_AUTH_PATHS = ['/v1/auth/login', '/v1/auth/forgot-password', '/v1/auth/reset-password'];

function isPublicAuthRequest(url: string | undefined): boolean {
  if (!url) return false;
  return PUBLIC_AUTH_PATHS.some((path) => url.includes(path));
}

export function setupApiInterceptors(): void {
  apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    if (!isPublicAuthRequest(config.url)) {
      const token = getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  });

  apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        const hadAuthHeader = Boolean(error.config?.headers?.Authorization);
        const isLoginRequest = isPublicAuthRequest(error.config?.url);
        if (hadAuthHeader && !isLoginRequest) {
          clearAuthStorage();
        }
      }
      return Promise.reject(error);
    },
  );
}
