import { ALLOWED_ADMIN_ROLES } from '@/lib/auth/constants';
import type { AdminRole } from '@/types/auth';

export function normalizeAdminRole(role: string): AdminRole | null {
  const trimmed = role.trim();
  const match = ALLOWED_ADMIN_ROLES.find(
    (allowed) => allowed.toLowerCase() === trimmed.toLowerCase(),
  );
  return match ?? null;
}
