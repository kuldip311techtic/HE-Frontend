export interface AuthUser {
  id: string;
  email: string;
  role: string;
  org_id: string | null;
  first_name: string;
  last_name: string;
  is_super_admin: boolean;
  is_active: boolean;
}

export interface AuthLoginRequest {
  email?: string;
  username?: string;
  password: string;
}

export interface AuthLoginResponse {
  access_token: string;
  token_type: 'bearer';
  user: AuthUser;
}
