import { ALLOWED_ADMIN_ROLES } from '@/lib/auth/constants';
import type { AdminRole } from '@/types/auth';

export function isAdminRole(role: string | undefined | null): role is AdminRole {
  if (!role) return false;
  return (ALLOWED_ADMIN_ROLES as readonly string[]).includes(role);
}
