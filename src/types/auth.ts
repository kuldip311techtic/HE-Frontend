export interface ApiErrorEnvelope {
  success?: false;
  message?: string;
  description?: string;
  detail?: string;
  error?: {
    code: string;
    details: unknown[];
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponseData {
  access_token: string;
  token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  redirect_to: string;
  email: string;
  description: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  email: string;
  token: string;
  description: string;
  data: LoginResponseData;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
