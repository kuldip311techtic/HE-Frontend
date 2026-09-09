export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface EndpointDefinition {
  method: HttpMethod;
  path: string;
}

export const endpoints = {
  authLogin: { method: 'POST', path: '/api/v1/auth/login' } satisfies EndpointDefinition,
  superAdminDashboard: {
    method: 'GET',
    path: '/api/v1/super-admin/dashboard',
  } satisfies EndpointDefinition,

  organizationsList: {
    method: 'GET',
    path: '/api/v1/super-admin/organizations',
  } satisfies EndpointDefinition,
  organizationsCreate: {
    method: 'POST',
    path: '/api/v1/super-admin/organizations',
  } satisfies EndpointDefinition,
  organizationsUpdate: {
    method: 'PUT',
    path: '/api/v1/super-admin/organizations/{organization_id}',
  } satisfies EndpointDefinition,
  organizationsDelete: {
    method: 'DELETE',
    path: '/api/v1/super-admin/organizations/{organization_id}',
  } satisfies EndpointDefinition,

  usersList: { method: 'GET', path: '/api/v1/super-admin/users' } satisfies EndpointDefinition,
  usersCreate: { method: 'POST', path: '/api/v1/super-admin/users' } satisfies EndpointDefinition,
  usersUpdate: {
    method: 'PUT',
    path: '/api/v1/super-admin/users/{user_id}',
  } satisfies EndpointDefinition,
  usersDelete: {
    method: 'DELETE',
    path: '/api/v1/super-admin/users/{user_id}',
  } satisfies EndpointDefinition,

  subscriptionPlansList: {
    method: 'GET',
    path: '/api/v1/super-admin/subscription-plans',
  } satisfies EndpointDefinition,
  subscriptionPlansCreate: {
    method: 'POST',
    path: '/api/v1/super-admin/subscription-plans',
  } satisfies EndpointDefinition,
  subscriptionPlansUpdate: {
    method: 'PUT',
    path: '/api/v1/super-admin/subscription-plans/{plan_id}',
  } satisfies EndpointDefinition,
  subscriptionPlansDelete: {
    method: 'DELETE',
    path: '/api/v1/super-admin/subscription-plans/{plan_id}',
  } satisfies EndpointDefinition,
  subscriptionCurrencies: {
    method: 'GET',
    path: '/api/v1/super-admin/subscription-plans/currencies',
  } satisfies EndpointDefinition,

  supportRequestsList: {
    method: 'GET',
    path: '/api/v1/support-requests',
  } satisfies EndpointDefinition,

  playerRoleSelection: {
    method: 'GET',
    path: '/api/v1/player/role-selection',
  } satisfies EndpointDefinition,
  organizationAdminTeam: {
    method: 'GET',
    path: '/api/v1/organization-admin/teams/{team_id}',
  } satisfies EndpointDefinition,
  sessionDetail: {
    method: 'GET',
    path: '/sessions/{session_id}',
  } satisfies EndpointDefinition,
} as const;

export function fillPath(path: string, params: Record<string, string>): string {
  return Object.entries(params).reduce(
    (result, [key, value]) => result.replace(`{${key}}`, encodeURIComponent(value)),
    path,
  );
}
