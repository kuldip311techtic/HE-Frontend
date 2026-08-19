export const queryKeys = {
  auth: {
    login: ['auth', 'login'] as const,
  },
} as const;

export const AUTH_QUERY_KEY = queryKeys.auth.login;
