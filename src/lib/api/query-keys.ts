export const queryKeys = {
  superAdmin: {
    login: ["super-admin", "login"] as const,
    dashboard: ["super-admin", "dashboard"] as const,
    quickAccess: ["super-admin", "quick-access"] as const,
    users: (page: number, limit: number) =>
      ["super-admin", "users", { page, limit }] as const,
    organizations: ["super-admin", "organizations"] as const,
  },
} as const;
