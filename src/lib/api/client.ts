import {
  ApiError,
  type ApiRequestOptions,
  type ErrorResponse,
} from '../../types/api';
import { clearAuth, getStoredToken } from '../auth/session';
import { LOGIN_PATH } from '../auth/constants';

const DEFAULT_BASE_URL = '/api';

function resolveBaseUrl(): string {
  const configured = import.meta.env.VITE_API_BASE_URL?.trim();
  return configured && configured.length > 0 ? configured : DEFAULT_BASE_URL;
}

function buildUrl(path: string): string {
  const baseUrl = resolveBaseUrl().replace(/\/$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
}

async function parseErrorResponse(response: Response): Promise<ApiError> {
  try {
    const payload = (await response.json()) as ErrorResponse;
    return new ApiError(
      payload.message || 'Request failed.',
      response.status,
      payload.description,
      payload.error?.code,
    );
  } catch {
    return new ApiError('Request failed.', response.status);
  }
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const { body, skipAuth = false, headers, ...requestInit } = options;
  const requestHeaders = new Headers(headers);

  if (!requestHeaders.has('Content-Type') && body !== undefined) {
    requestHeaders.set('Content-Type', 'application/json');
  }

  if (!skipAuth) {
    const token = getStoredToken();
    if (token) {
      requestHeaders.set('Authorization', `Bearer ${token}`);
    }
  }

  const response = await fetch(buildUrl(path), {
    ...requestInit,
    headers: requestHeaders,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (response.status === 401 && !path.includes('/auth/login')) {
    clearAuth();

    if (window.location.pathname !== LOGIN_PATH) {
      window.location.assign(LOGIN_PATH);
    }
  }

  if (!response.ok) {
    throw await parseErrorResponse(response);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export function getApiBaseUrl(): string {
  return resolveBaseUrl();
}

export default apiRequest;
