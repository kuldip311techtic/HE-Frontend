export type UserRole =
  | 'admin'
  | 'super_admin'
  | 'super-admin'
  | 'Super Admin'
  | 'Admin'
  | 'coach'
  | 'player'
  | string;

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  roles: UserRole[];
}

export interface AuthState {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export const AUTH_STORAGE_KEY = 'he_admin_auth';

export interface StoredAuth {
  token: string;
  user: AuthUser;
}
