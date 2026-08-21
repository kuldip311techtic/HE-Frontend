export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginTokenData {
  access_token: string;
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
  description: string;
  data: LoginTokenData;
}

export interface ErrorDetail {
  code: string;
  details: unknown;
}

export interface ErrorResponse {
  success: boolean;
  message: string;
  description: string;
  error: ErrorDetail;
}

export class ApiError extends Error {
  public readonly status: number;
  public readonly description: string;
  public readonly code: string | undefined;

  constructor(
    message: string,
    status: number,
    description = '',
    code?: string,
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.description = description;
    this.code = code;
  }
}

export interface ApiRequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  skipAuth?: boolean;
}
