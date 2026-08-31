export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token?: string;
  access_token?: string;
  message?: string;
}

export interface AuthSession {
  token: string;
}
