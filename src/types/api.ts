export interface ApiErrorDetail {
  field: string;
  message: string;
}

export interface ApiErrorEnvelope {
  success: boolean;
  error: {
    code: string;
    message: string;
    details?: ApiErrorDetail[];
  };
}

export class ApiClientError extends Error {
  code: string;
  details: ApiErrorDetail[];
  status: number;

  constructor(message: string, code: string, status: number, details: ApiErrorDetail[] = []) {
    super(message);
    this.name = "ApiClientError";
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export function isApiErrorEnvelope(value: unknown): value is ApiErrorEnvelope {
  if (typeof value !== "object" || value === null) return false;
  const obj = value as Record<string, unknown>;
  if (typeof obj.error !== "object" || obj.error === null) return false;
  const error = obj.error as Record<string, unknown>;
  return typeof error.message === "string";
}
