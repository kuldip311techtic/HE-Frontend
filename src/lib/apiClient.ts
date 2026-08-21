import { parseErrorResponse } from "@/lib/api/parse";
import { ApiError } from "@/lib/api/errors";
import { clearSession, getAccessToken } from "@/lib/auth/session";

export { ApiError } from "@/lib/api/errors";

type RequestInterceptor = (init: RequestInit) => RequestInit;
type ResponseInterceptor = (response: Response) => Response;

function resolveBaseUrl(): string {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  if (!baseUrl) {
    throw new Error("VITE_API_BASE_URL is not configured");
  }
  return baseUrl.replace(/\/$/, "");
}

function attachAuthHeader(init: RequestInit): RequestInit {
  const token = getAccessToken();
  if (!token) {
    return init;
  }

  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${token}`);
  return { ...init, headers };
}

function handleUnauthorized(response: Response): Response {
  const isLoginRequest = response.url.includes("/auth/login");
  if (response.status === 401 && !isLoginRequest) {
    clearSession();
    window.dispatchEvent(new Event("admin:session-cleared"));
  }
  return response;
}

const requestInterceptors: RequestInterceptor[] = [attachAuthHeader];
const responseInterceptors: ResponseInterceptor[] = [handleUnauthorized];

function applyRequestInterceptors(init: RequestInit): RequestInit {
  return requestInterceptors.reduce(
    (current, interceptor) => interceptor(current),
    init,
  );
}

function applyResponseInterceptors(response: Response): Response {
  return responseInterceptors.reduce(
    (current, interceptor) => interceptor(current),
    response,
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

async function toApiError(response: Response): Promise<ApiError> {
  try {
    const body: unknown = await response.json();
    const parsed = parseErrorResponse(body);
    if (parsed) {
      return new ApiError(
        parsed.message,
        response.status,
        parsed.error.code,
        parsed.error.details,
      );
    }
    if (isRecord(body) && typeof body.message === "string") {
      return new ApiError(body.message, response.status);
    }
  } catch {
    return new ApiError(
      response.statusText || "Request failed",
      response.status,
    );
  }

  return new ApiError(response.statusText || "Request failed", response.status);
}

export async function apiClient(
  path: string,
  init: RequestInit = {},
): Promise<unknown> {
  const headers = new Headers(init.headers);
  if (!headers.has("Content-Type") && init.body) {
    headers.set("Content-Type", "application/json");
  }
  headers.set("Accept", "application/json");

  const requestInit = applyRequestInterceptors({ ...init, headers });
  const response = applyResponseInterceptors(
    await fetch(`${resolveBaseUrl()}${path}`, requestInit),
  );

  if (!response.ok) {
    throw await toApiError(response);
  }

  return response.json();
}
