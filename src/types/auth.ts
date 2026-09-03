export type AdminRole =
  | 'super_admin'
  | 'admin'
  | 'organization_admin'
  | 'coach'
  | 'player';

export type AllowedAdminRole = 'super_admin' | 'admin' | 'organization_admin';

export interface AuthUser {
  id: string;
  name: string;
  role: AdminRole;
  email: string;
}

export const ALLOWED_ADMIN_ROLES: AllowedAdminRole[] = [
  'super_admin',
  'admin',
  'organization_admin',
];

export const FORBIDDEN_ROLES: AdminRole[] = ['coach', 'player'];

export function isAdminRole(role: AdminRole): role is AllowedAdminRole {
  return ALLOWED_ADMIN_ROLES.includes(role as AllowedAdminRole);
}

export function getRoleLabel(role: AdminRole): string {
  switch (role) {
    case 'super_admin':
      return 'Super Admin';
    case 'organization_admin':
      return 'Organization Admin';
    case 'admin':
      return 'Admin';
    case 'coach':
      return 'Coach';
    case 'player':
      return 'Player';
    default:
      return role;
  }
}
