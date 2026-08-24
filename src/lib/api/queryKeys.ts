export const queryKeys = {
  auth: {
    login: ['auth', 'login'] as const,
  },
  organizations: {
    all: ['organizations'] as const,
    list: (page: number, pageSize: number) =>
      ['organizations', 'list', page, pageSize] as const,
  },
} as const;

export const AUTH_QUERY_KEY = queryKeys.auth.login;
