import type { InternalAxiosRequestConfig } from 'axios';
import { apiClient } from './client';
import { getAuthToken, clearAuthStorage } from '@/lib/auth/auth-storage';
import { isValidationProbeToken } from '@/lib/validation/config';

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
        const token = getAuthToken();
        if (hadAuthHeader && !isValidationProbeToken(token)) {
          clearAuthStorage();
        }
      }
      return Promise.reject(error);
    },
  );
}
