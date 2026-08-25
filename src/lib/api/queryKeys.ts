export const queryKeys = {
  auth: {
    login: ['auth', 'login'] as const,
  },
  subscriptions: ['subscriptions'] as const,
  supportRequests: ['support-requests'] as const,
  dashboard: ['dashboard'] as const,
} as const;

export const AUTH_QUERY_KEY = queryKeys.auth.login;
export const SUBSCRIPTIONS_QUERY_KEY = queryKeys.subscriptions;
export const SUPPORT_REQUESTS_QUERY_KEY = queryKeys.supportRequests;
export const DASHBOARD_QUERY_KEY = queryKeys.dashboard;
