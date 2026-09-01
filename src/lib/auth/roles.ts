import type { UserRole } from '@/types';

export const ADMIN_ROLES: UserRole[] = ['super_admin', 'admin'];

export function isAdminRole(role: UserRole | string): boolean {
  return ADMIN_ROLES.includes(role as UserRole);
}

export function hasAdminAccess(roles: UserRole[] | string[]): boolean {
  return roles.some((role) => isAdminRole(role));
}
