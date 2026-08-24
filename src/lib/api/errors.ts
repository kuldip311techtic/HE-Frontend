import axios from 'axios';
import type { ApiErrorEnvelope, ErrorResponse } from '../../types/api';

function readErrorMessage(data: ErrorResponse | ApiErrorEnvelope | undefined): string | undefined {
  if (!data) {
    return undefined;
  }

  if ('detail' in data && typeof data.detail === 'string' && data.detail) {
    return data.detail;
  }

  if ('message' in data && typeof data.message === 'string' && data.message) {
    return data.message;
  }

  return undefined;
}

export function getApiErrorMessage(
  error: unknown,
  fallback: string,
): string {
  if (axios.isAxiosError<ErrorResponse | ApiErrorEnvelope>(error)) {
    if (!error.response) {
      return 'Unable to reach the server. Check your connection and try again.';
    }

    return readErrorMessage(error.response.data) ?? fallback;
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

  if (status === 409 && field === 'contact_email') {
    return message || 'An organization with this contact email already exists.';
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
