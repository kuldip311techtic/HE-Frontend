import {
  ApiClientError,
  isApiErrorEnvelope,
  type ApiErrorDetail,
} from "@/types/api";

const AUTH_TOKEN_KEY = "super_admin_token";

export function getApiBaseUrl(): string {
  return import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3300/api";
}

/** Join a locked contract path (e.g. `/api/v1/...`) to the configured API base URL. */
export function toClientPath(contractPath: string): string {
  const path = contractPath.startsWith("/") ? contractPath : `/${contractPath}`;
  const base = getApiBaseUrl().replace(/\/$/, "");

  if (path.startsWith("/api") && (base.endsWith("/api") || base.endsWith("/api/"))) {
    return path.slice("/api".length) || "/";
  }

  return path;
}

export type ListUnwrapKey = "data" | "items" | "results";

export function unwrapListResponse<T>(
  body: unknown,
  listUnwrapKey: ListUnwrapKey
): T {
  if (typeof body !== "object" || body === null) {
    return body as T;
  }

  const record = body as Record<string, unknown>;
  const wrapped = record[listUnwrapKey];

  if (wrapped === undefined) {
    return body as T;
  }

  if (Array.isArray(wrapped)) {
    return body as T;
  }

  if (typeof wrapped === "object" && wrapped !== null) {
    return wrapped as T;
  }

  return body as T;
}

export function getAuthToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setAuthToken(token: string): void {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function clearAuthToken(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  return Boolean(getAuthToken());
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  auth?: boolean;
}

async function parseErrorResponse(
  response: Response
): Promise<{ message: string; code: string; details: ApiErrorDetail[] }> {
  try {
    const data: unknown = await response.json();
    if (isApiErrorEnvelope(data)) {
      return {
        message: data.error.message,
        code: data.error.code ?? "UNKNOWN_ERROR",
        details: data.error.details ?? [],
      };
    }
    if (typeof data === "object" && data !== null) {
      const obj = data as Record<string, unknown>;
      if (typeof obj.message === "string") {
        return {
          message: obj.message,
          code: "API_ERROR",
          details: [],
        };
      }
      if (typeof obj.detail === "string") {
        return {
          message: obj.detail,
          code: "API_ERROR",
          details: [],
        };
      }
    }
  } catch {
    // fall through
  }
  return {
    message: response.statusText || "An unexpected error occurred",
    code: "HTTP_ERROR",
    details: [],
  };
}

export async function apiClient<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { body, auth = true, headers: customHeaders, ...rest } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(customHeaders as Record<string, string>),
  };

  if (auth) {
    const token = getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...rest,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const { message, code, details } = await parseErrorResponse(response);
    throw new ApiClientError(message, code, response.status, details);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    return response.json() as Promise<T>;
  }

  return undefined as T;
}
