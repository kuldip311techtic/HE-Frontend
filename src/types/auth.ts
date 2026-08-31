export type UserRole =
  | 'super_admin'
  | 'admin'
  | 'coach'
  | 'player';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface AuthState {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
}

export const ADMIN_ROLES: readonly UserRole[] = ['super_admin', 'admin'];

export function isAdminRole(role: UserRole): boolean {
  return ADMIN_ROLES.includes(role);
}
