export const API_ENDPOINTS = {
  superAdminDashboard: '/api/v1/super-admin/dashboard',
} as const;

export const queryKeys = {
  superAdmin: {
    dashboard: ['super-admin', 'dashboard'] as const,
  },
} as const;
