export type UserRole =
  | "organization_admin"
  | "super_admin"
  | "admin"
  | "coach"
  | "player";

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  roles: UserRole[];
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export const ADMIN_ROLES: UserRole[] = [
  "organization_admin",
  "super_admin",
  "admin",
];

export function isAdminRole(role: UserRole): boolean {
  return ADMIN_ROLES.includes(role);
}

export function userHasAdminAccess(user: AuthUser | null): boolean {
  if (!user) return false;
  if (isAdminRole(user.role)) return true;
  return user.roles.some(isAdminRole);
}
