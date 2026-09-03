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
    /** Ticket alias: POST /api/super-admin/login (JAW-9607) — live route is /api/v1/auth/login */
    path: '/api/v1/auth/login',
    listUnwrapKey: null as string | null,
  },
  superAdminDashboard: {
    method: 'GET' as const,
    /** Ticket alias: GET /api/super-admin/dashboard */
    path: '/api/v1/super-admin/dashboard',
    listUnwrapKey: null as string | null,
  },
  superAdminQuickAccess: {
    method: 'GET' as const,
    /** Ticket path: GET /api/super-admin/quick-access (JAW-9609) */
    path: '/api/super-admin/quick-access',
    listUnwrapKey: null as string | null,
  },
  superAdminSubscriptionPlans: {
    method: 'GET' as const,
    /** Ticket alias: GET /api/super-admin/subscriptions — live route is /api/v1/super-admin/subscription-plans (JAW-9612) */
    path: '/api/v1/super-admin/subscription-plans',
    listUnwrapKey: 'items' as string | null,
  },
  superAdminSubscriptionPlansCreate: {
    method: 'POST' as const,
    /** Ticket alias: POST /api/super-admin/subscriptions — live route is /api/v1/super-admin/subscription-plans */
    path: '/api/v1/super-admin/subscription-plans',
    listUnwrapKey: null as string | null,
  },
  superAdminSubscriptionUpdate: {
    method: 'PUT' as const,
    /** Ticket alias: PUT /api/super-admin/subscriptions/{id} — live route is /api/v1/super-admin/subscription-plans/{plan_id} */
    path: '/api/v1/super-admin/subscription-plans/{plan_id}',
    listUnwrapKey: null as string | null,
  },
  superAdminSubscriptionDelete: {
    method: 'DELETE' as const,
    /** Ticket alias: DELETE /api/super-admin/subscriptions/{id} — live route is /api/v1/super-admin/subscription-plans/{plan_id} */
    path: '/api/v1/super-admin/subscription-plans/{plan_id}',
    listUnwrapKey: null as string | null,
  },
  superAdminSubscriptionPlansCurrencies: {
    method: 'GET' as const,
    path: '/api/v1/super-admin/subscription-plans/currencies',
    listUnwrapKey: 'items' as string | null,
  },
  superAdminOrganizations: {
    method: 'GET' as const,
    /** Ticket alias: GET /api/super-admin/organizations (JAW-9610) */
    path: '/api/v1/super-admin/organizations',
    listUnwrapKey: 'items' as string | null,
  },
  superAdminOrganizationsCreate: {
    method: 'POST' as const,
    /** Ticket alias: POST /api/super-admin/organizations */
    path: '/api/v1/super-admin/organizations',
    listUnwrapKey: null as string | null,
  },
  superAdminOrganizationDetail: {
    method: 'GET' as const,
    path: '/api/v1/super-admin/organizations/{organization_id}',
    listUnwrapKey: null as string | null,
  },
  playerRoleSelection: {
    method: 'GET' as const,
    path: '/api/v1/player/role-selection',
    listUnwrapKey: null as string | null,
  },
} as const;

/** Replace `{param}` placeholders in contract paths. */
export function contractPathWithParams(
  contractPath: string,
  params: Record<string, string>,
): string {
  return Object.entries(params).reduce(
    (path, [key, value]) => path.replace(`{${key}}`, encodeURIComponent(value)),
    contractPath,
  );
}

export type ContractRoute = (typeof CONTRACT_ROUTES)[keyof typeof CONTRACT_ROUTES];

const DEFAULT_API_BASE_URL = '/api';

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
