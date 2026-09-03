export const queryKeys = {
  superAdmin: {
    /** GET /api/v1/super-admin/dashboard */
    dashboard: ['super-admin', 'dashboard', '/api/v1/super-admin/dashboard'] as const,
    /** GET /api/super-admin/quick-access */
    quickAccess: ['super-admin', 'quick-access', '/api/super-admin/quick-access'] as const,
    subscriptionPlans: (
      role: string,
      params: Record<string, string | number | null | undefined>,
    ) =>
      [
        'super-admin',
        'subscription-plans',
        '/api/v1/super-admin/subscription-plans',
        role,
        params,
      ] as const,
    subscriptionPlanCurrencies: [
      'super-admin',
      'subscription-plans',
      '/api/v1/super-admin/subscription-plans/currencies',
    ] as const,
    organizations: (params: Record<string, string | number | null | undefined>) =>
      [
        'super-admin',
        'organizations',
        '/api/v1/super-admin/organizations',
        params,
      ] as const,
  },
} as const;
