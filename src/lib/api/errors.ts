import type { ApiErrorBody, ErrorDetail, ErrorFieldDetail } from '@/types/api';
import { isRecord } from '@/lib/isRecord';

export class ApiError extends Error {
  status: number;
  body: ApiErrorBody | null;

  constructor(message: string, status: number, body: ApiErrorBody | null = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

function parseErrorDetails(value: unknown): ErrorFieldDetail[] | null | undefined {
  if (value === null) return null;
  if (!Array.isArray(value)) return undefined;
  const details: ErrorFieldDetail[] = [];
  for (const item of value) {
    if (!isRecord(item)) continue;
    const field = typeof item.field === 'string' ? item.field : undefined;
    const message =
      typeof item.message === 'string'
        ? item.message
        : typeof item.msg === 'string'
          ? item.msg
          : undefined;
    if (field || message) {
      details.push({ field, message });
    }
  }
  return details;
}

function parseNestedError(value: unknown): ErrorDetail | string | null | undefined {
  if (value === undefined) return undefined;
  if (value === null) return null;
  if (typeof value === 'string') return value;
  if (!isRecord(value)) return undefined;
  const code = typeof value.code === 'string' ? value.code : 'ERROR';
  const message = typeof value.message === 'string' ? value.message : '';
  if (!message && !value.code) return undefined;
  return {
    code,
    message,
    details: parseErrorDetails(value.details),
  };
}

function firstValidationMessage(detail: unknown): string | undefined {
  if (typeof detail === 'string' && detail.trim()) return detail.trim();
  if (!Array.isArray(detail)) return undefined;
  for (const item of detail) {
    if (!isRecord(item)) continue;
    if (typeof item.msg === 'string' && item.msg.trim()) return item.msg.trim();
    if (typeof item.message === 'string' && item.message.trim()) return item.message.trim();
  }
  return undefined;
}

export function parseErrorBody(value: unknown): ApiErrorBody | null {
  if (!isRecord(value)) return null;
  return {
    success: typeof value.success === 'boolean' ? value.success : undefined,
    error: parseNestedError(value.error),
    message: typeof value.message === 'string' ? value.message : undefined,
    status: typeof value.status === 'string' ? value.status : undefined,
    detail: value.detail,
  };
}

function nestedErrorMessage(body: ApiErrorBody | null): string | undefined {
  if (!body) return undefined;
  if (typeof body.error === 'string' && body.error.trim()) return body.error.trim();
  if (body.error && typeof body.error === 'object' && body.error.message.trim()) {
    return body.error.message.trim();
  }
  if (typeof body.message === 'string' && body.message.trim()) return body.message.trim();
  const validation = firstValidationMessage(body.detail);
  if (validation) return validation;
  return undefined;
}

export interface GetApiErrorMessageOptions {
  isLogin?: boolean;
}

export function getApiErrorMessage(
  err: unknown,
  fallback = 'Something went wrong. Please try again.',
  options: GetApiErrorMessageOptions = {},
): string {
  if (err instanceof ApiError) {
    const nested = nestedErrorMessage(err.body);
    if (options.isLogin && (err.status === 401 || err.status === 400)) {
      return nested || 'Invalid email or password.';
    }
    if (err.status === 401) {
      return 'Your session may have expired. Please sign in again.';
    }
    if (err.status >= 500 || err.status === 408) {
      return fallback;
    }
    if (nested) return nested;
    if (err.status >= 400) {
      return fallback;
    }
    if (err.message && !err.message.includes('AxiosError') && !/^Request failed with status/i.test(err.message)) {
      return err.message;
    }
    return fallback;
  }

  if (err instanceof TypeError) {
    return 'Unable to connect. Please check your connection.';
  }

  if (err instanceof Error && err.message) {
    if (/AxiosError|Request failed with status/i.test(err.message)) {
      return fallback;
    }
    return err.message;
  }

  return fallback;
}

function fieldFromValidationLoc(loc: unknown): string | undefined {
  if (!Array.isArray(loc)) return undefined;
  const parts = loc.filter((part): part is string => typeof part === 'string' && part !== 'body');
  return parts.at(-1);
}

export function getApiFieldErrors(err: unknown): Record<string, string> {
  const fields: Record<string, string> = {};
  if (!(err instanceof ApiError) || !err.body) return fields;

  const nested = err.body.error;
  if (nested && typeof nested === 'object' && Array.isArray(nested.details)) {
    for (const item of nested.details) {
      if (item.field && item.message) {
        fields[item.field] = item.message;
      }
    }
  }

  if (Array.isArray(err.body.detail)) {
    for (const item of err.body.detail) {
      if (!isRecord(item)) continue;
      const field = fieldFromValidationLoc(item.loc);
      const message =
        typeof item.msg === 'string'
          ? item.msg
          : typeof item.message === 'string'
            ? item.message
            : undefined;
      if (field && message) {
        fields[field] = message;
      }
    }
  }

  return fields;
}

export function getDuplicateEmailMessage(err: unknown): string | null {
  if (!(err instanceof ApiError)) return null;
  const nested = nestedErrorMessage(err.body) ?? '';
  const looksDuplicate =
    err.status === 409 || /already (exists|in use|taken)|duplicate/i.test(nested);
  if (!looksDuplicate) return null;
  if (/email/i.test(nested) && nested.trim()) return nested.trim();
  return 'This email is already in use.';
}

export async function parseResponseError(response: Response): Promise<ApiError> {
  let body: ApiErrorBody | null = null;
  try {
    const json: unknown = await response.json();
    body = parseErrorBody(json);
  } catch {
    body = null;
  }

  const message = nestedErrorMessage(body) || 'Request failed';
  return new ApiError(message, response.status, body);
}
