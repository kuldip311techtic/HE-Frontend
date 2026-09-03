export const queryKeys = {
  superAdmin: {
    dashboard: ['super-admin', 'dashboard'] as const,
    organizations: (page: number, pageSize: number, search?: string) =>
      ['super-admin', 'organizations', page, pageSize, search ?? ''] as const,
    users: (page: number, pageSize: number, search?: string, role?: string) =>
      ['super-admin', 'users', page, pageSize, search ?? '', role ?? ''] as const,
    subscriptionPlans: (
      role: string,
      page: number,
      pageSize: number,
      search?: string,
      status?: string,
    ) =>
      ['super-admin', 'subscription-plans', role, page, pageSize, search ?? '', status ?? ''] as const,
    supportRequests: (page: number, pageSize: number, search?: string) =>
      ['super-admin', 'support-requests', page, pageSize, search ?? ''] as const,
  },
  organization: {
    profile: ['organization', 'profile'] as const,
  },
  player: {
    roleSelection: (sessionToken: string) =>
      ['player', 'role-selection', sessionToken] as const,
  },
} as const;
