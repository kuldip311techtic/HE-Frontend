export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface EndpointDefinition {
  method: HttpMethod;
  path: string;
}

export const endpoints = {
  authLogin: { method: 'POST', path: '/api/super-admin/login' } satisfies EndpointDefinition,
  superAdminDashboard: {
    method: 'GET',
    path: '/api/v1/super-admin/dashboard',
  } satisfies EndpointDefinition,
  organizations: {
    list: { method: 'GET', path: '/api/super-admin/organizations' } satisfies EndpointDefinition,
    create: { method: 'POST', path: '/api/super-admin/organizations' } satisfies EndpointDefinition,
    update: { method: 'PUT', path: '/api/super-admin/organizations/{id}' } satisfies EndpointDefinition,
    delete: { method: 'DELETE', path: '/api/super-admin/organizations/{id}' } satisfies EndpointDefinition,
  },
  users: {
    list: { method: 'GET', path: '/api/super-admin/users' } satisfies EndpointDefinition,
    create: { method: 'POST', path: '/api/super-admin/users' } satisfies EndpointDefinition,
    update: { method: 'PUT', path: '/api/super-admin/users/{id}' } satisfies EndpointDefinition,
    delete: { method: 'DELETE', path: '/api/super-admin/users/{id}' } satisfies EndpointDefinition,
  },
  subscriptions: {
    list: { method: 'GET', path: '/api/super-admin/subscriptions' } satisfies EndpointDefinition,
    create: { method: 'POST', path: '/api/super-admin/subscriptions' } satisfies EndpointDefinition,
    update: { method: 'PUT', path: '/api/super-admin/subscriptions/{id}' } satisfies EndpointDefinition,
    delete: { method: 'DELETE', path: '/api/super-admin/subscriptions/{id}' } satisfies EndpointDefinition,
  },
  supportRequests: {
    list: { method: 'GET', path: '/api/super-admin/support-requests' } satisfies EndpointDefinition,
    create: { method: 'POST', path: '/api/super-admin/support-requests' } satisfies EndpointDefinition,
    update: { method: 'PUT', path: '/api/super-admin/support-requests/{id}' } satisfies EndpointDefinition,
  },
} as const;

export function withPathParam(path: string, id: string): string {
  return path.replace('{id}', id);
}
