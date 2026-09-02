import axios, { type AxiosError, isAxiosError } from 'axios';
import type { ApiErrorBody } from '@/types/auth';

const NETWORK_ERROR = 'Unable to connect. Please check your connection.';
const SESSION_EXPIRED = 'Your session may have expired. Please sign in again.';
const GENERIC_ERROR = 'Something went wrong. Please try again.';

function extractBackendMessage(data: unknown): string | undefined {
  if (!data || typeof data !== 'object') return undefined;

  const body = data as ApiErrorBody;

  if (typeof body.message === 'string' && body.message.trim()) {
    return body.message;
  }
  if (typeof body.detail === 'string' && body.detail.trim()) {
    return body.detail;
  }
  if (typeof body.error === 'string' && body.error.trim()) {
    return body.error;
  }
  if (body.errors && typeof body.errors === 'object') {
    const firstKey = Object.keys(body.errors)[0];
    const firstMessages = firstKey ? body.errors[firstKey] : undefined;
    if (firstMessages?.[0]) {
      return firstMessages[0];
    }
  }

  return undefined;
}

export function getApiErrorMessage(
  err: unknown,
  fallback = GENERIC_ERROR,
): string {
  if (isAxiosError(err)) {
    const axiosError = err as AxiosError<ApiErrorBody>;

    if (!axiosError.response) {
      if (axiosError.code === 'ECONNABORTED') {
        return 'The request is taking longer than expected. Please check the current status before trying again.';
      }
      return NETWORK_ERROR;
    }

    const status = axiosError.response.status;
    const backendMessage = extractBackendMessage(axiosError.response.data);

    if (status === 401) {
      return SESSION_EXPIRED;
    }

    if (status >= 500) {
      return fallback;
    }

    if (backendMessage) {
      return backendMessage;
    }

    if (status === 404) {
      return 'The requested resource was not found.';
    }

    if (status === 403) {
      return 'You do not have permission to perform this action.';
    }

    return fallback;
  }

  if (err instanceof Error && err.message && !err.message.includes('AxiosError')) {
    return err.message;
  }

  return fallback;
}

export { axios };
