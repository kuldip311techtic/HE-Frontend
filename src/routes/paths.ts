export const paths = {
  root: '/',
  admin: '/admin',
  login: '/admin/login',
  dashboard: '/admin/dashboard',
} as const;

export type AppPath = (typeof paths)[keyof typeof paths];

export const adminPublicNavigation = [
  { label: 'Login', to: paths.login },
] as const;

export const adminNavigation = [
  { label: 'Dashboard', to: paths.dashboard },
] as const;
