export const paths = {
  root: '/',
  admin: '/admin',
  login: '/admin/login',
  dashboard: '/super-admin/dashboard',
  legacyDashboard: '/admin/dashboard',
  subscriptions: '/super-admin/subscriptions',
  supportRequests: '/super-admin/support-requests',
  organizations: '/super-admin/organizations',
  coaches: '/super-admin/coaches',
  players: '/super-admin/players',
} as const;

export type AppPath = (typeof paths)[keyof typeof paths];

export const adminPublicNavigation = [
  { label: 'Login', to: paths.login },
] as const;

export const adminNavigation = [
  { label: 'Dashboard', to: paths.dashboard },
  { label: 'Subscriptions', to: paths.subscriptions },
  { label: 'Support Requests', to: paths.supportRequests },
] as const;
