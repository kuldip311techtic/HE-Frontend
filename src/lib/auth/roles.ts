import type { UserRole } from '@/types/auth';
import { ADMIN_ROLES } from '@/types/auth';

export function isAdminRole(role: UserRole): boolean {
  return ADMIN_ROLES.includes(role);
}

export function hasAdminAccess(roles: UserRole[]): boolean {
  return roles.some((role) => isAdminRole(role));
}

export function normalizeRole(role: string): UserRole {
  const normalized = role.toLowerCase().replace(/\s+/g, '_') as UserRole;
  return normalized;
}

export function getEffectiveRoles(user: {
  role: UserRole;
  roles?: UserRole[];
}): UserRole[] {
  const roles = user.roles?.length ? user.roles : [user.role];
  return roles.map((r) => normalizeRole(r));
}

export function canAccessAdmin(user: {
  role: UserRole;
  roles?: UserRole[];
}): boolean {
  return hasAdminAccess(getEffectiveRoles(user));
}
