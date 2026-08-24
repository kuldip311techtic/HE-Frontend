export const paths = {
  root: '/',
  admin: '/admin',
  login: '/admin/login',
  dashboard: '/admin/dashboard',
  manageOrganizations: '/super-admin/manage-organizations',
} as const;

export type AppPath = (typeof paths)[keyof typeof paths];

export const adminPublicNavigation = [{ label: 'Login', to: paths.login }] as const;

export const adminNavigation = [
  { label: 'Dashboard', to: paths.dashboard },
  { label: 'Manage Organizations', to: paths.manageOrganizations },
] as const;
