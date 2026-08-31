import { AUTH_TOKEN_KEY } from '@/lib/utils';
import type { ErrorResponse } from '@/types';

export class ApiClientError extends Error {
  readonly code: string;
  readonly status: number;
  readonly details: ErrorResponse['error']['details'];

  constructor(
    message: string,
    code: string,
    status: number,
    details: ErrorResponse['error']['details'] = [],
  ) {
    super(message);
    this.name = 'ApiClientError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

function resolveBaseUrl(): string {
  const envUrl = import.meta.env.VITE_API_BASE_URL as string | undefined;
  const base = (envUrl ?? 'http://localhost:3300').replace(/\/$/, '');

  // Normalize legacy env values that include a trailing /api segment.
  if (base.endsWith('/api')) {
    return base.slice(0, -4);
  }

  return base;
}

export const API_BASE_URL = resolveBaseUrl();

function getAuthToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

function buildHeaders(customHeaders?: HeadersInit): Headers {
  const headers = new Headers(customHeaders);
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const token = getAuthToken();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  return headers;
}

async function parseErrorResponse(response: Response): Promise<ApiClientError> {
  try {
    const body = (await response.json()) as ErrorResponse;
    if (body.error) {
      return new ApiClientError(
        body.error.message,
        body.error.code,
        response.status,
        body.error.details ?? [],
      );
    }
  } catch {
    // fall through to generic error
  }

  return new ApiClientError(
    response.statusText || 'Request failed',
    'REQUEST_FAILED',
    response.status,
  );
}

export interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { body, headers: customHeaders, ...rest } = options;
  const url = `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;

  const response = await fetch(url, {
    ...rest,
    headers: buildHeaders(customHeaders),
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw await parseErrorResponse(response);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export const apiClient = {
  get: <T>(path: string, options?: RequestOptions) =>
    apiRequest<T>(path, { ...options, method: 'GET' }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    apiRequest<T>(path, { ...options, method: 'POST', body }),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    apiRequest<T>(path, { ...options, method: 'PUT', body }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    apiRequest<T>(path, { ...options, method: 'PATCH', body }),
  delete: <T>(path: string, options?: RequestOptions) =>
    apiRequest<T>(path, { ...options, method: 'DELETE' }),
};
