import { isRecord } from '@/lib/isRecord';

export const API_PATHS = {
  login: '/api/v1/auth/login',
  dashboard: '/api/v1/super-admin/dashboard',
  organizations: '/api/v1/super-admin/organizations',
  organizationById: '/api/v1/super-admin/organizations/{organization_id}',
  users: '/api/v1/super-admin/users',
  userById: '/api/v1/super-admin/users/{user_id}',
  subscriptionPlans: '/api/v1/super-admin/subscription-plans',
  subscriptionPlanById: '/api/v1/super-admin/subscription-plans/{plan_id}',
  supportRequests: '/api/v1/support-requests',
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

export function subscriptionPlanPath(plan_id: string): string {
  return fillPath(API_PATHS.subscriptionPlanById, { plan_id });
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

function listArrayFromPayload(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;
  if (!isRecord(payload)) return [];
  if (Array.isArray(payload.items)) return payload.items;
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.results)) return payload.results;
  return [];
}

export function unwrapListItems<T>(
  payload: unknown,
  isItem: (value: unknown) => value is T,
): T[] {
  return listArrayFromPayload(payload).filter(isItem);
}

export function isIdentifiedItem(value: unknown): value is Record<string, unknown> & { id: string } {
  return isRecord(value) && typeof value.id === 'string' && value.id.length > 0;
}
