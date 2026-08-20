import axios from 'axios';
import type { ErrorResponse } from '../../types/api';

export function getApiErrorMessage(
  error: unknown,
  fallback: string,
): string {
  if (axios.isAxiosError<ErrorResponse>(error)) {
    if (!error.response) {
      return 'Unable to reach the server. Check your connection and try again.';
    }

    return error.response.data?.message ?? fallback;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

export function getFieldErrorFromApi(
  error: unknown,
  field: string,
): string | undefined {
  if (!axios.isAxiosError<ErrorResponse>(error)) {
    return undefined;
  }

  const status = error.response?.status;
  const message = error.response?.data?.message ?? '';

  if (status === 409 && field === 'email') {
    return message || 'An organization with this email already exists.';
  }

  const details = error.response?.data?.error?.details;
  if (details && typeof details === 'object' && field in details) {
    const value = (details as Record<string, unknown>)[field];
    if (typeof value === 'string') {
      return value;
    }
  }

  return undefined;
}
