export type AdminRole = 'admin' | 'super_admin';

export const SUPER_ADMIN_ROLE: AdminRole = 'super_admin';

const ADMIN_ROLE_ALIASES = new Set(['admin', 'super_admin', 'superadmin']);

export function normalizeRole(role: string): string {
  return role
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, '_');
}

export function isAdminRole(role: string | null): boolean {
  if (!role) {
    return false;
  }

  return ADMIN_ROLE_ALIASES.has(normalizeRole(role));
}
