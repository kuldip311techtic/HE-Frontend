import type { AuthUser } from '@/types/auth';

const ADMIN_ROLES = new Set(['admin', 'super_admin', 'super-admin']);

export function isAdminRole(user: AuthUser | null | undefined): boolean {
  if (!user) return false;
  if (user.is_super_admin === true) return true;
  return ADMIN_ROLES.has(user.role);
}

export function getUserDisplayName(user: AuthUser): string {
  const parts = [user.first_name, user.last_name].filter(Boolean);
  if (parts.length > 0) return parts.join(' ');
  return user.email;
}

export function getRoleLabel(user: AuthUser): string {
  if (user.is_super_admin) return 'Super Admin';
  if (user.role === 'admin') return 'Admin';
  return user.role.replace(/[-_]/g, ' ');
}
