import axios, { type AxiosError, type AxiosInstance } from "axios";
import type { ApiErrorBody } from "@/types/api";
import { clearAuthStorage, getStoredToken, isValidationAuthToken } from "@/lib/auth/storage";
import { resolveApiBaseUrl } from "@/lib/api/resolve-base-url";

const baseURL = resolveApiBaseUrl(import.meta.env.VITE_API_BASE_URL);

export function getApiErrorMessage(
  err: unknown,
  fallback = "Something went wrong. Please try again.",
): string {
  if (!axios.isAxiosError(err)) {
    if (err instanceof Error && err.message.includes("Network Error")) {
      return "Unable to connect. Please check your connection.";
    }
    return fallback;
  }

  const axiosErr = err as AxiosError<ApiErrorBody>;

  if (!axiosErr.response) {
    if (axiosErr.code === "ECONNABORTED") {
      return "The request is taking longer than expected. Please check the current status before trying again.";
    }
    return "Unable to connect. Please check your connection.";
  }

  const status = axiosErr.response.status;
  const data = axiosErr.response.data as ApiErrorBody;

  if (status === 401) {
    return "Your session may have expired. Please sign in again.";
  }

  if (status >= 500) {
    return fallback;
  }

  const nestedError = data?.error;
  if (nestedError && typeof nestedError === "object" && nestedError.message) {
    return nestedError.message;
  }
  if (nestedError && typeof nestedError === "object" && nestedError.details?.[0]?.message) {
    return nestedError.details[0].message;
  }

  if (typeof data?.message === "string" && data.message.trim()) {
    return data.message;
  }

  if (typeof data?.detail === "string" && data.detail.trim()) {
    return data.detail;
  }

  if (typeof data?.error === "string" && data.error.trim()) {
    return data.error;
  }

  if (data?.errors) {
    const firstField = Object.values(data.errors)[0];
    if (firstField?.[0]) return firstField[0];
  }

  return fallback;
}

/** Map API validation errors to form field names for inline FormMessage display. */
export function getApiFieldErrors(err: unknown): Record<string, string> {
  const result: Record<string, string> = {};

  if (!axios.isAxiosError(err)) {
    return result;
  }

  const data = err.response?.data as ApiErrorBody | undefined;
  if (!data) {
    return result;
  }

  if (data.errors) {
    for (const [field, messages] of Object.entries(data.errors)) {
      if (messages?.[0]) {
        result[field] = messages[0];
      }
    }
  }

  const nestedError = data.error;
  if (nestedError && typeof nestedError === "object" && nestedError.details) {
    for (const detail of nestedError.details) {
      if (detail.field && detail.message) {
        result[detail.field] = detail.message;
      }
    }
  }

  const message = getApiErrorMessage(err, "");
  if (message && !result.email && /email/i.test(message)) {
    result.email = message;
  }

  return result;
}

export const apiClient: AxiosInstance = axios.create({
  baseURL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
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
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      if (isValidationAuthToken()) {
        return Promise.reject(error);
      }
      clearAuthStorage();
      const path = window.location.pathname;
      const isPublicAdminRoute =
        path === "/admin/login" || path === "/admin/unauthorized";
      if (path.startsWith("/admin") && !isPublicAdminRoute) {
        window.location.href = "/admin/unauthorized";
      }
    }
    return Promise.reject(error);
  },
);

export async function apiGet<T>(path: string): Promise<T> {
  const response = await apiClient.get<T>(path);
  return response.data;
}

export async function apiPost<T, B = unknown>(
  path: string,
  body?: B,
): Promise<T> {
  const response = await apiClient.post<T>(path, body);
  return response.data;
}

export async function apiPut<T, B = unknown>(
  path: string,
  body?: B,
): Promise<T> {
  const response = await apiClient.put<T>(path, body);
  return response.data;
}

export async function apiDelete<T>(path: string): Promise<T> {
  const response = await apiClient.delete<T>(path);
  return response.data;
}
