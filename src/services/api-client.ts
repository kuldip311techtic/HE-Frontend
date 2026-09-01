import { getStoredToken } from "@/lib/utils";
import {
  ApiError,
  isApiErrorEnvelope,
  type ApiErrorEnvelope,
} from "@/types/auth";

const DEFAULT_BASE_URL = "http://localhost:3300/api";

export class ApiClientError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly details?: ApiErrorEnvelope["error"]["details"];

  constructor(
    message: string,
    status: number,
    code?: string,
    details?: ApiErrorEnvelope["error"]["details"],
  ) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

function getBaseUrl(): string {
  const baseUrl = import.meta.env.VITE_API_BASE_URL ?? DEFAULT_BASE_URL;
  return baseUrl.replace(/\/$/, "");
}

export function resolveApiUrl(path: string): string {
  const base = getBaseUrl();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  if (base.endsWith("/api") && normalizedPath.startsWith("/api/")) {
    return `${base}${normalizedPath.slice(4)}`;
  }

  return `${base}${normalizedPath}`;
}

async function parseErrorResponse(response: Response): Promise<ApiClientError> {
  try {
    const body: unknown = await response.json();

    if (isApiErrorEnvelope(body)) {
      return new ApiClientError(
        body.error.message || "An unexpected error occurred.",
        response.status,
        body.error.code,
        body.error.details,
      );
    }

    const legacyBody = body as { message?: string; description?: string };
    return new ApiClientError(
      legacyBody.message || legacyBody.description || "An unexpected error occurred.",
      response.status,
    );
  } catch {
    return new ApiClientError(
      "An unexpected error occurred.",
      response.status,
    );
  }
}

export interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  auth?: boolean;
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { body, auth = false, headers, ...rest } = options;

  const requestHeaders = new Headers(headers);
  requestHeaders.set("Accept", "application/json");

  if (body !== undefined) {
    requestHeaders.set("Content-Type", "application/json");
  }

  if (auth) {
    const token = getStoredToken();
    if (token) {
      requestHeaders.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(resolveApiUrl(path), {
    ...rest,
    headers: requestHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw await parseErrorResponse(response);
  }

  const responseBody: unknown = await response.json();

  if (isApiErrorEnvelope(responseBody)) {
    throw new ApiClientError(
      responseBody.error.message,
      response.status,
      responseBody.error.code,
      responseBody.error.details,
    );
  }

  return responseBody as T;
}

export type ListUnwrapKey = "data" | "items" | "results";

export function unwrapListResponse<T>(
  body: unknown,
  listUnwrapKey: ListUnwrapKey,
): T {
  if (typeof body !== "object" || body === null) {
    return body as T;
  }

  const record = body as Record<string, unknown>;

  if (listUnwrapKey in record) {
    return body as T;
  }

  for (const envelopeKey of ["data", "results"] as const) {
    const nested = record[envelopeKey];
    if (
      nested &&
      typeof nested === "object" &&
      listUnwrapKey in (nested as Record<string, unknown>)
    ) {
      return nested as T;
    }
  }

  return body as T;
}

export { ApiError };
