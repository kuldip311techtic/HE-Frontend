export const queryKeys = {
  superAdmin: {
    dashboard: ['super-admin', 'dashboard'] as const,
    organizations: (page: number, pageSize: number) =>
      ['super-admin', 'organizations', page, pageSize] as const,
    users: (page: number, pageSize: number) =>
      ['super-admin', 'users', page, pageSize] as const,
  },
  organization: {
    profile: ['organization', 'profile'] as const,
  },
} as const;
