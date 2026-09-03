/**
 * Locked OpenAPI contract routes.
 * Paths are the exact backend route strings; join to VITE_API_BASE_URL via contractPathToClientPath().
 *
 * Example: GET /api/v1/super-admin/dashboard with baseURL http://localhost:3300/api
 *          → client request GET /v1/super-admin/dashboard
 */
export const CONTRACT_ROUTES = {
  authLogin: {
    method: 'POST' as const,
    path: '/api/v1/auth/login',
    listUnwrapKey: null as string | null,
  },
  superAdminDashboard: {
    method: 'GET' as const,
    /** Ticket alias: GET /api/super-admin/dashboard */
    path: '/api/v1/super-admin/dashboard',
    listUnwrapKey: null as string | null,
  },
  playerRoleSelection: {
    method: 'GET' as const,
    path: '/api/v1/player/role-selection',
    listUnwrapKey: null as string | null,
  },
  sessionDetail: {
    method: 'GET' as const,
    path: '/api/v1/sessions/{session_id}',
    listUnwrapKey: null as string | null,
  },
} as const;

export type ContractRoute = (typeof CONTRACT_ROUTES)[keyof typeof CONTRACT_ROUTES];

const DEFAULT_API_BASE_URL = 'http://localhost:3300/api';

/**
 * Strip the `/api` prefix from contract paths when the client baseURL already ends with `/api`.
 */
export function contractPathToClientPath(contractPath: string): string {
  const baseURL = (import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL).replace(/\/$/, '');

  if (baseURL.endsWith('/api') && contractPath.startsWith('/api/')) {
    return contractPath.slice('/api'.length);
  }

  if (baseURL.endsWith('/api') && contractPath === '/api') {
    return '/';
  }

  return contractPath;
}

export function unwrapListResponse<T>(body: unknown, listUnwrapKey: string | null): T {
  if (listUnwrapKey && body && typeof body === 'object' && listUnwrapKey in body) {
    return (body as Record<string, T>)[listUnwrapKey];
  }
  return body as T;
}
