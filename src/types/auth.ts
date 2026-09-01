export interface ApiErrorDetail {
  field?: string;
  message: string;
}

export interface ApiErrorEnvelope {
  success: false;
  error: {
    code: string;
    message: string;
    details?: ApiErrorDetail[];
  };
}

export function isApiErrorEnvelope(value: unknown): value is ApiErrorEnvelope {
  return (
    typeof value === "object" &&
    value !== null &&
    "success" in value &&
    (value as ApiErrorEnvelope).success === false &&
    "error" in value &&
    typeof (value as ApiErrorEnvelope).error === "object" &&
    (value as ApiErrorEnvelope).error !== null
  );
}

export function throwIfApiErrorEnvelope(value: unknown): void {
  if (isApiErrorEnvelope(value)) {
    const { message, code, details } = value.error;
    throw new ApiError(message, code, details);
  }
}

export class ApiError extends Error {
  readonly code: string;
  readonly details?: ApiErrorDetail[];

  constructor(message: string, code: string, details?: ApiErrorDetail[]) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.details = details;
  }
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponseData {
  access_token: string;
  refresh_token?: string;
  token_type?: string;
  expires_in?: number;
  redirect_to?: string;
  email?: string;
}

export interface LoginResponse {
  success?: boolean;
  message?: string;
  access_token?: string;
  data?: LoginResponseData;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
