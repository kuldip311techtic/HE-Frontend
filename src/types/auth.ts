import type { UserPublic } from "@/types/api";

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

function normalizeRole(role: string): UserRole {
  const normalized = role.toLowerCase().replace(/-/g, "_");
  const validRoles: UserRole[] = [
    "organization_admin",
    "super_admin",
    "admin",
    "coach",
    "player",
  ];
  if (validRoles.includes(normalized as UserRole)) {
    return normalized as UserRole;
  }
  if (normalized === "org_admin") return "organization_admin";
  return "admin";
}

/** Map API UserPublic to client AuthUser */
export function mapUserPublicToAuthUser(user: UserPublic): AuthUser {
  const primaryRole = user.is_super_admin
    ? "super_admin"
    : normalizeRole(user.role);

  const apiRoles = user.roles?.length
    ? user.roles.map(normalizeRole)
    : [primaryRole];

  const roles = user.is_super_admin && !apiRoles.includes("super_admin")
    ? (["super_admin", ...apiRoles] as UserRole[])
    : apiRoles;

  return {
    id: user.id,
    email: user.email,
    firstName: user.first_name ?? "",
    lastName: user.last_name ?? "",
    role: primaryRole,
    roles,
  };
}
