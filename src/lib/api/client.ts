import { AUTH_STORAGE_KEY, type StoredAuth } from '@/types/auth';
import { API_PATHS } from '@/lib/api/endpoints';
import {
  ApiError,
  type ApiErrorEnvelope,
  type RequestOptions,
} from '@/types/api';

type TokenGetter = () => string | null;

let getAuthToken: TokenGetter = () => {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as StoredAuth;
    return parsed.token ?? null;
  } catch {
    return null;
  }
};

export function setAuthTokenGetter(getter: TokenGetter): void {
  getAuthToken = getter;
}

function resolveBaseUrl(): string {
  const fromEnv =
    import.meta.env.VITE_API_BASE_URL ?? import.meta.env.NEXT_PUBLIC_API_URL;
  return (fromEnv ?? 'http://localhost:3033').replace(/\/$/, '');
}

export function buildApiUrl(path: string): string {
  const base = resolveBaseUrl();

  if (base.endsWith('/api') && path.startsWith('/api/')) {
    return `${base}${path.slice(4)}`;
  }

  return `${base}${path}`;
}

async function parseErrorResponse(response: Response): Promise<string> {
  try {
    const payload = (await response.json()) as ApiErrorEnvelope;
    if (typeof payload.detail === 'string' && payload.detail.length > 0) {
      return payload.detail;
    }
  } catch {
    // fall through to status text
  }

  return response.statusText || 'Request failed';
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = 'GET', body, headers = {}, signal } = options;
  const token = getAuthToken();

  const requestHeaders: Record<string, string> = {
    Accept: 'application/json',
    ...headers,
  };

  if (body !== undefined) {
    requestHeaders['Content-Type'] = 'application/json';
  }

  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(buildApiUrl(path), {
    method,
    headers: requestHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal,
  });

  if (!response.ok) {
    const detail = await parseErrorResponse(response);
    throw new ApiError(response.status, detail);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export const apiClient = {
  get: <T>(path: string, signal?: AbortSignal) =>
    apiRequest<T>(path, { method: 'GET', signal }),
  post: <T>(path: string, body?: unknown, signal?: AbortSignal) =>
    apiRequest<T>(path, { method: 'POST', body, signal }),
  put: <T>(path: string, body?: unknown, signal?: AbortSignal) =>
    apiRequest<T>(path, { method: 'PUT', body, signal }),
  patch: <T>(path: string, body?: unknown, signal?: AbortSignal) =>
    apiRequest<T>(path, { method: 'PATCH', body, signal }),
  delete: <T>(path: string, signal?: AbortSignal) =>
    apiRequest<T>(path, { method: 'DELETE', signal }),
  paths: API_PATHS,
  buildUrl: buildApiUrl,
};
