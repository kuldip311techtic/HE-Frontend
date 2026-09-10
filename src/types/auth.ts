export const ALLOWED_ADMIN_ROLES = [
  'super_admin',
  'admin',
  'Super Admin',
  'Admin',
] as const;

export type AdminRole = (typeof ALLOWED_ADMIN_ROLES)[number];

export interface AdminSession {
  token: string;
  role: AdminRole;
  email: string;
  name: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
