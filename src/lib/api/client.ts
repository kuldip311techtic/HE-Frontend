import { toast } from 'sonner';
import { getStoredToken } from '@/lib/auth/storage';
import { ApiError, type ApiRequestOptions, type ErrorResponse } from '@/types/api';

const DEFAULT_BASE_URL = 'http://localhost:3300/api';

function getBaseUrl(): string {
  const configured = import.meta.env.VITE_API_BASE_URL?.trim();
  return configured || DEFAULT_BASE_URL;
}

/**
 * Resolves a contract path against the configured base URL without duplicating /api.
 * e.g. base=http://localhost:3300/api + path=/api/v1/... => http://localhost:3300/api/v1/...
 */
export function resolveApiUrl(path: string): string {
  const base = getBaseUrl().replace(/\/$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  if (base.endsWith('/api') && normalizedPath.startsWith('/api/')) {
    return `${base.slice(0, -4)}${normalizedPath}`;
  }

  return `${base}${normalizedPath}`;
}

async function parseErrorResponse(response: Response): Promise<ApiError> {
  try {
    const payload = (await response.json()) as ErrorResponse;
    if (payload?.error?.message) {
      return new ApiError(
        payload.error.message,
        response.status,
        payload.error.code,
        payload.error.details,
      );
    }
  } catch {
    // fall through to generic message
  }

  return new ApiError(
    response.statusText || 'Request failed',
    response.status,
    'HTTP_ERROR',
  );
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const { body, skipAuth = false, headers, ...rest } = options;
  const requestHeaders = new Headers(headers);

  if (body !== undefined && !requestHeaders.has('Content-Type')) {
    requestHeaders.set('Content-Type', 'application/json');
  }

  if (!skipAuth) {
    const token = getStoredToken();
    if (token) {
      requestHeaders.set('Authorization', `Bearer ${token}`);
    }
  }

  const response = await fetch(resolveApiUrl(path), {
    ...rest,
    headers: requestHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = await parseErrorResponse(response);
    throw error;
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export function showApiError(error: unknown, fallback = 'Something went wrong'): void {
  if (error instanceof ApiError) {
    toast.error(error.message);
    return;
  }

  if (error instanceof Error) {
    toast.error(error.message);
    return;
  }

  toast.error(fallback);
}

export { getBaseUrl };
