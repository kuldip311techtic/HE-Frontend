import { AUTH_UNAUTHORIZED_EVENT } from '@/lib/auth/constants';
import {
  getSession,
  isDevBypassToken,
  rejectSession,
} from '@/lib/auth/session';
import { parseResponseError } from '@/lib/api/errors';
import { resolveUrl } from '@/lib/api/resolveUrl';

export type ApiRequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
  skipAuth?: boolean;
  ignoreUnauthorized?: boolean;
};

function dispatchUnauthorized(): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(AUTH_UNAUTHORIZED_EVENT));
  if (!window.location.pathname.startsWith('/admin/login')) {
    window.location.replace('/admin/login');
  }
}

async function request<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { body, skipAuth = false, ignoreUnauthorized = false, headers: initHeaders, ...rest } = options;

  const headers = new Headers(initHeaders);
  if (body !== undefined && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (!skipAuth) {
    const session = getSession();
    if (session?.token && !isDevBypassToken(session.token)) {
      headers.set('Authorization', `Bearer ${session.token}`);
    }
  }

  const response = await fetch(resolveUrl(path), {
    ...rest,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (response.status === 401 && !ignoreUnauthorized) {
    rejectSession();
    dispatchUnauthorized();
  }

  if (!response.ok) {
    throw await parseResponseError(response);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export const api = {
  get: <T>(path: string, options?: ApiRequestOptions) =>
    request<T>(path, { ...options, method: 'GET' }),
  post: <T>(path: string, body?: unknown, options?: ApiRequestOptions) =>
    request<T>(path, { ...options, method: 'POST', body }),
  put: <T>(path: string, body?: unknown, options?: ApiRequestOptions) =>
    request<T>(path, { ...options, method: 'PUT', body }),
  patch: <T>(path: string, body?: unknown, options?: ApiRequestOptions) =>
    request<T>(path, { ...options, method: 'PATCH', body }),
  delete: <T>(path: string, body?: unknown, options?: ApiRequestOptions) =>
    request<T>(path, { ...options, method: 'DELETE', body }),
};

export { resolveUrl, getApiBaseUrl } from '@/lib/api/resolveUrl';
export {
  getApiErrorMessage,
  getApiFieldErrors,
  getDuplicateEmailMessage,
  ApiError,
} from '@/lib/api/errors';
