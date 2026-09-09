export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface EndpointDefinition {
  method: HttpMethod;
  path: string;
}

export const endpoints = {
  authLogin: { method: 'POST', path: '/v1/auth/login' } satisfies EndpointDefinition,
  superAdminDashboard: {
    method: 'GET',
    path: '/api/super-admin/dashboard',
  } satisfies EndpointDefinition,
} as const;
