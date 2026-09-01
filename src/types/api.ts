export interface ErrorResponse {
  success: boolean;
  error: {
    code: string;
    message: string;
    details: unknown[] | null;
  };
}

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details: unknown[] | null;

  constructor(
    message: string,
    status: number,
    code = 'UNKNOWN_ERROR',
    details: unknown[] | null = null,
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export interface ApiRequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  skipAuth?: boolean;
}
