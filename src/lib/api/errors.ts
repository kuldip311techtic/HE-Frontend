import type { ApiErrorBody } from '@/types/api';

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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function parseErrorBody(value: unknown): ApiErrorBody | null {
  if (!isRecord(value)) return null;
  return {
    success: typeof value.success === 'boolean' ? value.success : undefined,
    error: typeof value.error === 'string' || value.error === null ? value.error : undefined,
    message: typeof value.message === 'string' ? value.message : undefined,
    status: typeof value.status === 'string' ? value.status : undefined,
  };
}

export function getApiErrorMessage(err: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (err instanceof ApiError) {
    if (err.status === 401) {
      return 'Your session may have expired. Please sign in again.';
    }
    if (err.status >= 500) {
      return fallback;
    }
    const message = err.body?.message?.trim();
    const errorField = err.body?.error?.trim();
    if (message) return message;
    if (errorField) return errorField;
    if (err.status >= 400) {
      return fallback;
    }
    return err.message || fallback;
  }

  if (err instanceof TypeError) {
    return 'Unable to connect. Please check your connection.';
  }

  if (err instanceof Error && err.message) {
    return err.message;
  }

  return fallback;
}

export async function parseResponseError(response: Response): Promise<ApiError> {
  let body: ApiErrorBody | null = null;
  try {
    const json: unknown = await response.json();
    body = parseErrorBody(json);
  } catch {
    body = null;
  }

  const message = getApiErrorMessage(
    new ApiError(body?.message || body?.error || 'Request failed', response.status, body),
    'Something went wrong. Please try again.',
  );

  return new ApiError(message, response.status, body);
}
