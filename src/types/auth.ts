export type UserRole = 'super_admin' | 'org_admin' | 'coach' | 'player';

export interface AuthUser {
  id: string;
  email: string;
  role: string;
  org_id: string | null;
  first_name: string | null;
  last_name: string | null;
  is_super_admin: boolean;
  is_active: boolean;
  last_sign_in_at?: string | null;
}

export interface AuthLoginRequest {
  email: string;
  password: string;
}

export interface AuthLoginResponse {
  access_token: string;
  token_type?: string;
  expires_in_hours?: number;
  user: AuthUser;
}
