import type { ApiErrorEnvelope, ApiRequestOptions } from '@/types';
import { getStoredToken } from '@/lib/auth/storage';

const DEFAULT_BASE_URL = 'http://localhost:3300';

function resolveBaseUrl(): string {
  const envUrl = import.meta.env.VITE_API_BASE_URL as string | undefined;
  if (!envUrl) return DEFAULT_BASE_URL;
  return envUrl.replace(/\/api\/?$/, '');
}

export class ApiClientError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: unknown[];

  constructor(status: number, message: string, code = 'UNKNOWN', details?: unknown[]) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

function buildUrl(path: string, params?: ApiRequestOptions['params']): string {
  const base = resolveBaseUrl();
  const url = new URL(path.startsWith('/') ? path : `/${path}`, base);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    });
  }

  return url.toString();
}

async function parseErrorResponse(response: Response): Promise<ApiClientError> {
  try {
    const body = (await response.json()) as ApiErrorEnvelope;
    if (body.error) {
      return new ApiClientError(
        response.status,
        body.error.message,
        body.error.code,
        body.error.details,
      );
    }
  } catch {
    // fall through to generic error
  }
  return new ApiClientError(response.status, response.statusText || 'Request failed');
}

export async function apiClient<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const { body, params, headers: customHeaders, ...rest } = options;
  const token = getStoredToken();

  const headers: HeadersInit = {
    Accept: 'application/json',
    ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
    ...(customHeaders as Record<string, string>),
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(buildUrl(path, params), {
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

  return response.json() as Promise<T>;
}

export const apiPaths = {
  superAdminDashboard: '/api/v1/super-admin/dashboard',
} as const;

export { resolveBaseUrl };
