import { getStoredToken } from "@/lib/utils";
import type { ApiErrorEnvelope } from "@/types/auth";

const DEFAULT_BASE_URL = "http://localhost:3300/api";

export class ApiClientError extends Error {
  readonly status: number;
  readonly description?: string;

  constructor(message: string, status: number, description?: string) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.description = description;
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
    const body = (await response.json()) as ApiErrorEnvelope;
    const detail =
      body.detail ?? body.message ?? body.description ?? "An unexpected error occurred.";
    return new ApiClientError(detail, response.status, body.description ?? body.detail);
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

  return (await response.json()) as T;
}
