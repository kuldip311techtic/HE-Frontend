import { isAxiosError } from 'axios';
import type { ErrorResponse } from '@/types/api';

export interface ParsedApiError {
  message: string;
  fieldErrors: Record<string, string>;
}

function isErrorResponse(data: unknown): data is ErrorResponse {
  return (
    typeof data === 'object' &&
    data !== null &&
    'success' in data &&
    data.success === false &&
    'error' in data &&
    typeof (data as ErrorResponse).error?.message === 'string'
  );
}

export function getApiErrorMessage(error: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (isAxiosError(error)) {
    if (!error.response) {
      return 'Unable to connect. Please check your connection.';
    }

    const status = error.response.status;
    const data = error.response.data;

    if (status === 401) {
      return 'Your session may have expired. Please sign in again.';
    }

    if (status >= 500) {
      return fallback;
    }

    if (isErrorResponse(data)) {
      return data.error.message;
    }
  }

  return fallback;
}

export function parseApiError(error: unknown, fallback = 'Something went wrong. Please try again.'): ParsedApiError {
  const message = getApiErrorMessage(error, fallback);
  const fieldErrors: Record<string, string> = {};

  if (isAxiosError(error) && isErrorResponse(error.response?.data)) {
    const details = error.response.data.error.details;
    if (Array.isArray(details)) {
      for (const detail of details) {
        if (detail.field) {
          fieldErrors[detail.field] = detail.message;
        }
      }
    }
  }

  return { message, fieldErrors };
}

export function isUnauthorizedError(error: unknown): boolean {
  return isAxiosError(error) && error.response?.status === 401;
}
