/** Locked contract paths — use these exact strings in API calls. */
export const SUPER_ADMIN_PATHS = {
  login: '/api/super-admin/login',
  dashboard: '/api/v1/super-admin/dashboard',
  organizations: '/super-admin/organizations',
  organization: (id: string) => `/api/super-admin/organizations/${id}`,
  users: '/super-admin/users',
  user: (id: string) => `/api/super-admin/users/${id}`,
  subscriptions: '/api/super-admin/subscriptions',
  subscription: (id: string) => `/api/super-admin/subscriptions/${id}`,
  supportRequests: '/api/super-admin/support-requests',
  supportRequest: (id: string) => `/api/super-admin/support-requests/${id}`,
} as const;
