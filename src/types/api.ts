export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginData {
  token: string;
  token_type: string;
  expires_in: number;
  email: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  description: string;
  token: string;
  email: string;
  data: LoginData;
}

export interface HealthData {
  status: string;
}

export interface HealthResponse {
  success: boolean;
  message: string;
  email: null;
  token: null;
  data: HealthData;
}

export interface ErrorDetail {
  code: string;
  details: unknown;
}

export interface ErrorResponse {
  success: boolean;
  message: string;
  error: ErrorDetail;
}
