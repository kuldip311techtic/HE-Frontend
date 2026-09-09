import axios from 'axios';
import type { UseFormSetError, FieldValues, Path } from 'react-hook-form';
import type { ApiError, ApiErrorDetail } from '@/types/api';

interface ErrorPayload {
  message?: string;
  error?: ApiError | string;
  detail?: string | { loc?: Array<string | number>; msg?: string }[];
}

function isApiError(value: unknown): value is ApiError {
  return (
    typeof value === 'object' &&
    value !== null &&
    'message' in value &&
    typeof (value as { message: unknown }).message === 'string'
  );
}

function getPayload(error: unknown): ErrorPayload | undefined {
  if (!axios.isAxiosError(error)) return undefined;
  return error.response?.data as ErrorPayload | undefined;
}

export function getApiErrorCode(error: unknown): string | undefined {
  const data = getPayload(error);
  if (data?.error && isApiError(data.error) && data.error.code) {
    return data.error.code;
  }
  return undefined;
}

export function getApiFieldErrors(error: unknown): ApiErrorDetail[] {
  const data = getPayload(error);
  if (data?.error && isApiError(data.error) && Array.isArray(data.error.details)) {
    return data.error.details.filter(
      (detail): detail is ApiErrorDetail =>
        typeof detail.field === 'string' && typeof detail.message === 'string',
    );
  }
  if (Array.isArray(data?.detail)) {
    return data.detail
      .map((item) => {
        const loc = item.loc?.filter((part) => typeof part === 'string' && part !== 'body');
        const field = loc?.[loc.length - 1];
        if (!field || !item.msg) return null;
        return { field, message: item.msg };
      })
      .filter((item): item is ApiErrorDetail => item !== null);
  }
  return [];
}

export function applyApiFieldErrors<TFieldValues extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<TFieldValues>,
): boolean {
  const details = getApiFieldErrors(error);
  let applied = false;
  for (const detail of details) {
    setError(detail.field as Path<TFieldValues>, { message: detail.message });
    applied = true;
  }
  return applied;
}

function isLoginRequest(error: unknown): boolean {
  if (!axios.isAxiosError(error)) return false;
  const url = String(error.config?.url ?? '');
  return url.includes('/login');
}

export function getApiErrorMessage(
  error: unknown,
  fallback = 'Something went wrong. Please try again.',
): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const data = getPayload(error);
    const code = getApiErrorCode(error);

    if (error.code === 'ECONNABORTED') {
      return fallback;
    }

    if (status === 401 && !isLoginRequest(error)) {
      return 'Your session may have expired. Please sign in again.';
    }

    if (!error.response) {
      return 'Unable to connect. Please check your connection.';
    }

    if (status === 503) {
      return fallback;
    }

    if (status && status >= 500) {
      return fallback;
    }

    if (code === 'ORGANIZATION_HAS_DEPENDENCIES') {
      return data?.error && isApiError(data.error)
        ? data.error.message
        : 'This organization cannot be removed because it still has related records.';
    }

    if (code === 'CANNOT_DELETE_SELF') {
      return data?.error && isApiError(data.error)
        ? data.error.message
        : 'You cannot remove your own account.';
    }

    if (
      code === 'EMAIL_ALREADY_EXISTS' ||
      code === 'DUPLICATE_EMAIL' ||
      code === 'USER_ALREADY_EXISTS'
    ) {
      return data?.error && isApiError(data.error)
        ? data.error.message
        : 'This email is already in use.';
    }

    if (data?.error && isApiError(data.error)) {
      return data.error.message;
    }

    if (typeof data?.error === 'string' && data.error.trim()) {
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
