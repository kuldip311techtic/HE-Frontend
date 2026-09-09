export const queryKeys = {
  superAdminDashboard: ['super-admin', 'dashboard'] as const,
  organizations: {
    all: ['super-admin', 'organizations'] as const,
  },
  users: {
    all: ['super-admin', 'users'] as const,
    list: (page: number, limit: number) => ['super-admin', 'users', page, limit] as const,
  },
  subscriptions: {
    all: ['super-admin', 'subscriptions'] as const,
  },
  supportRequests: {
    all: ['super-admin', 'support-requests'] as const,
  },
};
