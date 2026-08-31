import type { ApiErrorEnvelope } from '@/types';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3300/api';

/**
 * Contract paths are documented with a leading `/api/` prefix while the env
 * base URL also ends with `/api`. Strip the duplicate segment when joining.
 */
export function resolveApiPath(path: string): string {
  if (path.startsWith('/api/') && API_BASE_URL.endsWith('/api')) {
    return path.slice(4);
  }
  return path;
}

export function getApiUrl(path: string): string {
  const normalizedPath = resolveApiPath(path);
  const base = API_BASE_URL.replace(/\/$/, '');
  const suffix = normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`;
  return `${base}${suffix}`;
}

export type ListUnwrapKey = 'data' | 'items' | 'results';

/**
 * Normalize list GET payloads that may be wrapped in `data` / `results` before
 * the contract `list_unwrap_key` field is reachable.
 */
export function unwrapListEnvelope<T>(
  body: unknown,
  listUnwrapKey: ListUnwrapKey,
): T {
  if (!body || typeof body !== 'object') {
    return body as T;
  }

  const record = body as Record<string, unknown>;
  if (listUnwrapKey in record) {
    return body as T;
  }

  for (const envelopeKey of ['data', 'results'] as const) {
    const nested = record[envelopeKey];
    if (nested && typeof nested === 'object' && listUnwrapKey in (nested as Record<string, unknown>)) {
      return nested as T;
    }
  }

  return body as T;
}

export class ApiClientError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly details?: ApiErrorEnvelope['error']['details'];

  constructor(
    message: string,
    status: number,
    code?: string,
    details?: ApiErrorEnvelope['error']['details'],
  ) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

function getAuthToken(): string | null {
  return localStorage.getItem('super_admin_token');
}

export function setAuthToken(token: string): void {
  localStorage.setItem('super_admin_token', token);
}

export function clearAuthToken(): void {
  localStorage.removeItem('super_admin_token');
  localStorage.removeItem('super_admin_user');
}

export function setAuthUser(user: { id: string; name: string; email: string }): void {
  localStorage.setItem('super_admin_user', JSON.stringify(user));
}

export function getAuthUser(): { id: string; name: string; email: string } | null {
  const raw = localStorage.getItem('super_admin_user');
  if (!raw) return null;
  try {
    return JSON.parse(raw) as { id: string; name: string; email: string };
  } catch {
    return null;
  }
}

async function parseErrorResponse(response: Response): Promise<ApiClientError> {
  try {
    const body = (await response.json()) as ApiErrorEnvelope | { message?: string; detail?: string };
    if ('error' in body && body.error?.message) {
      return new ApiClientError(
        body.error.message,
        response.status,
        body.error.code,
        body.error.details,
      );
    }
    if ('message' in body && body.message) {
      return new ApiClientError(body.message, response.status);
    }
    if ('detail' in body && body.detail) {
      return new ApiClientError(String(body.detail), response.status);
    }
  } catch {
    // fall through to generic message
  }
  return new ApiClientError(
    response.status === 401
      ? 'Invalid email or password. Please try again.'
      : 'Something went wrong. Please try again.',
    response.status,
  );
}

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  auth?: boolean;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, auth = true, headers: customHeaders, ...rest } = options;

  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(customHeaders as Record<string, string>),
  };

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  if (auth) {
    const token = getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(getApiUrl(path), {
    ...rest,
    headers,
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
