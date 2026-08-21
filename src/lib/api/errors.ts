import type { ErrorDetails } from "@/types/api";

export class ApiError extends Error {
  readonly status: number;
  readonly code: string | undefined;
  readonly details: ErrorDetails | null;

  constructor(
    message: string,
    status: number,
    code?: string,
    details: ErrorDetails | null = null,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}
