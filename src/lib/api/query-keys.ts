export const queryKeys = {
  superAdmin: {
    all: ['super-admin'] as const,
    dashboard: () => [...queryKeys.superAdmin.all, 'dashboard'] as const,
  },
} as const;
