import type { AuthUser } from '@/types/auth';

export const ADMIN_ROLES = ['super_admin', 'admin'] as const;

export function isAdminRole(role: string): boolean {
  return ADMIN_ROLES.includes(role as (typeof ADMIN_ROLES)[number]);
}

export function canAccessAdmin(user: AuthUser | null | undefined): boolean {
  if (!user) return false;
  return user.is_super_admin || isAdminRole(user.role);
}
