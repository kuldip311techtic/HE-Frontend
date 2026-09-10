export type AdminRole = 'super_admin' | 'admin' | 'Super Admin' | 'Admin' | string;

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
