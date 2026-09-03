import { isAxiosError } from 'axios';
import type { ErrorResponse } from '@/types/api';

export interface ParsedApiError {
  message: string;
  fieldErrors: Record<string, string>;
}

interface FastApiValidationItem {
  loc?: (string | number)[];
  msg: string;
  type?: string;
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

function parseFastApiValidation(data: unknown): ParsedApiError | null {
  if (typeof data !== 'object' || data === null || !('detail' in data)) {
    return null;
  }

  const detail = (data as { detail: unknown }).detail;
  if (!Array.isArray(detail) || detail.length === 0) {
    return null;
  }

  const fieldErrors: Record<string, string> = {};
  const messages: string[] = [];

  for (const item of detail) {
    if (typeof item !== 'object' || item === null || !('msg' in item)) {
      continue;
    }

    const validationItem = item as FastApiValidationItem;
    const msg = validationItem.msg;
    messages.push(msg);

    const loc = validationItem.loc;
    if (Array.isArray(loc) && loc.length > 0) {
      const field = loc[loc.length - 1];
      if (typeof field === 'string') {
        fieldErrors[field] = msg;
      }
    }
  }

  if (messages.length === 0) {
    return null;
  }

  return {
    message: messages[0],
    fieldErrors,
  };
}

interface ErrorResponseDetailItem {
  field?: string;
  message?: string;
  loc?: (string | number)[];
  msg?: string;
}

function mapValidationDetailToFieldErrors(details: unknown): Record<string, string> {
  const fieldErrors: Record<string, string> = {};

  if (!Array.isArray(details)) {
    return fieldErrors;
  }

  for (const item of details) {
    if (typeof item !== 'object' || item === null) {
      continue;
    }

    const detail = item as ErrorResponseDetailItem;
    const message = detail.message ?? detail.msg;
    if (!message) {
      continue;
    }

    if (detail.field) {
      fieldErrors[detail.field] = message;
      continue;
    }

    const loc = detail.loc;
    if (Array.isArray(loc) && loc.length > 0) {
      const field = loc[loc.length - 1];
      if (typeof field === 'string') {
        fieldErrors[field] = message;
      }
    }
  }

  return fieldErrors;
}

function parseErrorBody(data: unknown): ParsedApiError | null {
  if (isErrorResponse(data)) {
    const fieldErrors = mapValidationDetailToFieldErrors(data.error.details);
    return { message: data.error.message, fieldErrors };
  }

  return parseFastApiValidation(data);
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

    if (status === 404) {
      return fallback;
    }

    if (status >= 500) {
      return fallback;
    }

    const parsed = parseErrorBody(data);
    if (parsed) {
      return parsed.message;
    }
  }

  return fallback;
}

export function parseApiError(error: unknown, fallback = 'Something went wrong. Please try again.'): ParsedApiError {
  if (isAxiosError(error) && error.response) {
    const parsed = parseErrorBody(error.response.data);
    if (parsed) {
      return parsed;
    }

    if (error.response.status === 401) {
      return { message: 'Your session may have expired. Please sign in again.', fieldErrors: {} };
    }

    if (!error.response) {
      return { message: 'Unable to connect. Please check your connection.', fieldErrors: {} };
    }

    if (error.response.status >= 500) {
      return { message: fallback, fieldErrors: {} };
    }
  }

  if (isAxiosError(error) && !error.response) {
    return { message: 'Unable to connect. Please check your connection.', fieldErrors: {} };
  }

  return { message: fallback, fieldErrors: {} };
}

/** Login-specific error mapping — 401 means invalid credentials, not expired session. */
export function parseLoginApiError(
  error: unknown,
  fallback = 'Incorrect email or password. Please try again.',
): ParsedApiError {
  if (isAxiosError(error)) {
    if (!error.response) {
      return { message: 'Unable to connect. Please check your connection.', fieldErrors: {} };
    }

    const { status, data } = error.response;

    if (status === 401) {
      const parsed = parseErrorBody(data);
      return {
        message: parsed?.message ?? fallback,
        fieldErrors: parsed?.fieldErrors ?? {},
      };
    }

    if (status === 422) {
      const parsed = parseErrorBody(data) ?? parseFastApiValidation(data);
      if (parsed) {
        return parsed;
      }
    }

    const parsed = parseErrorBody(data);
    if (parsed) {
      return parsed;
    }

    if (status >= 500) {
      return { message: 'Unable to sign in. Please try again.', fieldErrors: {} };
    }
  }

  return { message: fallback, fieldErrors: {} };
}

export function isUnauthorizedError(error: unknown): boolean {
  return isAxiosError(error) && error.response?.status === 401;
}
