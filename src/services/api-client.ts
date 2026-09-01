import type { ApiErrorBody } from "@/types/super-admin";

const TOKEN_KEY = "super_admin_token";

export class ApiClientError extends Error {
  status: number;
  body: ApiErrorBody | null;

  constructor(message: string, status: number, body: ApiErrorBody | null = null) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.body = body;
  }
}

function getBaseUrl(): string {
  const base =
    import.meta.env.VITE_API_BASE_URL ??
    import.meta.env.NEXT_PUBLIC_API_URL ??
    "http://localhost:3300/api";
  return base.replace(/\/$/, "");
}

/** Contract paths include `/api`; base URL already ends with `/api`. */
export function buildApiUrl(contractPath: string): string {
  const base = getBaseUrl();
  let path = contractPath.startsWith("/") ? contractPath : `/${contractPath}`;
  if (path.startsWith("/api/")) {
    path = path.slice(4);
  }
  return `${base}${path}`;
}

export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAuthToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

function extractErrorMessage(body: ApiErrorBody | null, fallback: string): string {
  if (!body) return fallback;
  return (
    body.error?.message ??
    body.message ??
    body.detail ??
    fallback
  );
}

export interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  auth?: boolean;
}

export async function apiRequest<T>(
  contractPath: string,
  options: RequestOptions = {}
): Promise<T> {
  const { body, auth = true, headers: customHeaders, ...rest } = options;

  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(customHeaders as Record<string, string>),
  };

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (auth) {
    const token = getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(buildApiUrl(contractPath), {
    ...rest,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  let responseBody: ApiErrorBody | T | null = null;
  const contentType = response.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    responseBody = (await response.json()) as ApiErrorBody | T;
  }

  if (!response.ok) {
    throw new ApiClientError(
      extractErrorMessage(
        responseBody as ApiErrorBody | null,
        `Request failed with status ${response.status}`
      ),
      response.status,
      responseBody as ApiErrorBody | null
    );
  }

  return responseBody as T;
}

export function unwrapList<T>(
  data: Record<string, unknown>,
  key: "items" | "data" | "results"
): T[] {
  const list = data[key];
  return Array.isArray(list) ? (list as T[]) : [];
}
