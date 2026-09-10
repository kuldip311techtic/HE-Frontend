import { isRecord } from '@/lib/isRecord';

export const API_PATHS = {
  login: '/api/super-admin/login',
  dashboard: '/api/v1/super-admin/dashboard',
  organizations: '/api/v1/super-admin/organizations',
  organizationById: '/api/v1/super-admin/organizations/{organization_id}',
  users: '/api/v1/super-admin/users',
  userById: '/api/v1/super-admin/users/{user_id}',
  subscriptions: '/api/super-admin/subscriptions',
  subscriptionById: '/api/super-admin/subscriptions/{id}',
  supportRequests: '/api/v1/support-requests',
  ticketSupportRequests: '/api/super-admin/support-requests',
  ticketSupportRequestById: '/api/super-admin/support-requests/{id}',
} as const;

export function fillPath(template: string, params: Record<string, string>): string {
  return Object.entries(params).reduce(
    (path, [name, value]) => path.replace(`{${name}}`, value),
    template,
  );
}

export function organizationPath(organization_id: string): string {
  return fillPath(API_PATHS.organizationById, { organization_id });
}

export function userPath(user_id: string): string {
  return fillPath(API_PATHS.userById, { user_id });
}

export function subscriptionPath(id: string): string {
  return fillPath(API_PATHS.subscriptionById, { id });
}

export function ticketSupportRequestPath(id: string): string {
  return fillPath(API_PATHS.ticketSupportRequestById, { id });
}

export function withQuery(
  path: string,
  params: Record<string, string | number | boolean | undefined | null>,
): string {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    search.set(key, String(value));
  });
  const qs = search.toString();
  return qs ? `${path}?${qs}` : path;
}

export function unwrapListItems<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[];
  if (!isRecord(payload)) return [];
  if (Array.isArray(payload.items)) return payload.items as T[];
  if (Array.isArray(payload.data)) return payload.data as T[];
  if (Array.isArray(payload.results)) return payload.results as T[];
  return [];
}
