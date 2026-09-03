import { isAxiosError } from 'axios';

import type { ApiErrorEnvelope } from '@/types/api';

export function getApiErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    if (!error.response) {
      return 'Unable to connect. Please check your connection.';
    }

    const status = error.response.status;
    const data = error.response.data as ApiErrorEnvelope | { message?: string; detail?: string };

    if (status === 401) {
      return 'Your session may have expired. Please sign in again.';
    }

    if (status >= 500) {
      return 'Something went wrong. Please try again.';
    }

    if (data && typeof data === 'object') {
      if ('error' in data && data.error?.message) {
        return data.error.message;
      }
      if ('message' in data && typeof data.message === 'string') {
        return data.message;
      }
      if ('detail' in data && typeof data.detail === 'string') {
        return data.detail;
      }
    }
  }

  if (error instanceof Error && error.message && !error.message.startsWith('AxiosError')) {
    return error.message;
  }

  return 'Something went wrong. Please try again.';
}
