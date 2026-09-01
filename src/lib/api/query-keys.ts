export const queryKeys = {
  superAdmin: {
    login: ["super-admin", "login"] as const,
    dashboard: ["super-admin", "dashboard"] as const,
    users: (page: number, pageSize: number) =>
      ["super-admin", "users", { page, pageSize }] as const,
    organizations: (page: number, pageSize: number) =>
      ["super-admin", "organizations", { page, pageSize }] as const,
  },
} as const;
