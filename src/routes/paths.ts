export const paths = {
  root: '/',
  admin: '/admin',
  login: '/admin/login',
  dashboard: '/admin/dashboard',
  manageOrganizations: '/super-admin/manage-organizations',
  manageUsers: '/super-admin/manage-users',
  manageSupportRequests: '/super-admin/manage-support-requests',
} as const;

export type AppPath = (typeof paths)[keyof typeof paths];

export const adminPublicNavigation = [{ label: 'Login', to: paths.login }] as const;

export const adminNavigation = [
  { label: 'Dashboard', to: paths.dashboard },
  { label: 'Manage Organizations', to: paths.manageOrganizations },
  { label: 'Manage Users', to: paths.manageUsers },
  { label: 'Support Requests', to: paths.manageSupportRequests },
] as const;
