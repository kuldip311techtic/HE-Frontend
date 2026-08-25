export const paths = {
  root: '/',
  login: '/super-admin/login',
  dashboard: '/super-admin/dashboard',
  organizations: '/super-admin/organizations',
  coaches: '/super-admin/coaches',
  players: '/super-admin/players',
  subscriptions: '/super-admin/subscriptions',
  supportRequests: '/super-admin/support-requests',
} as const;

export type AppPath = (typeof paths)[keyof typeof paths];

export const adminPublicNavigation = [
  { label: 'Login', to: paths.login },
] as const;

export const adminNavigation = [
  { label: 'Dashboard', to: paths.dashboard },
  { label: 'Organizations', to: paths.organizations },
  { label: 'Coaches', to: paths.coaches },
  { label: 'Players', to: paths.players },
  { label: 'Subscriptions', to: paths.subscriptions },
  { label: 'Support Requests', to: paths.supportRequests },
] as const;
