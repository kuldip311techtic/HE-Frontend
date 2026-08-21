export const queryKeys = {
  auth: {
    login: ['auth', 'login'] as const,
  },
  dashboard: {
    root: ['dashboard'] as const,
  },
} as const;

export const AUTH_QUERY_KEY = queryKeys.auth.login;
export const DASHBOARD_QUERY_KEY = queryKeys.dashboard.root;
