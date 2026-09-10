import { ALLOWED_ADMIN_ROLES } from '@/lib/auth/constants';

export function isAdminRole(role: string | undefined | null): boolean {
  if (!role) return false;
  return (ALLOWED_ADMIN_ROLES as readonly string[]).includes(role);
}
