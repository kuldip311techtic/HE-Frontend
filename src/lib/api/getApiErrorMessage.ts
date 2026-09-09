import axios from 'axios';
import type { ApiError } from '@/types/api';

function isApiError(value: unknown): value is ApiError {
  return (
    typeof value === 'object' &&
    value !== null &&
    'message' in value &&
    typeof (value as ApiError).message === 'string'
  );
}

export function getApiErrorMessage(error: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const data = error.response?.data as
      | { message?: string; error?: ApiError | string; detail?: string | { msg?: string }[] }
      | undefined;

    if (status === 401) {
      return 'Your session may have expired. Please sign in again.';
    }

    if (!error.response) {
      return 'Unable to connect. Please check your connection.';
    }

    if (status && status >= 500) {
      return fallback;
    }

    if (data?.error && isApiError(data.error)) {
      return data.error.message;
    }

    if (typeof data?.error === 'string') {
      return data.error;
    }

    if (typeof data?.message === 'string' && data.message.trim()) {
      return data.message;
    }

    if (typeof data?.detail === 'string' && data.detail.trim()) {
      return data.detail;
    }

    if (Array.isArray(data?.detail) && data.detail[0]?.msg) {
      return data.detail[0].msg;
    }
  }

  if (error instanceof Error && error.message && !error.message.startsWith('AxiosError')) {
    return error.message;
  }

  return fallback;
}
