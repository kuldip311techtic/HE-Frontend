import {
  apiRequest,
  clearAuthToken,
  setAuthToken,
} from "@/services/api-client";
import type {
  LoginRequest,
  LoginResponse,
} from "@/types/super-admin";

function extractToken(response: LoginResponse): string | null {
  return response.token ?? response.access_token ?? response.jwt ?? null;
}

export async function loginSuperAdmin(
  credentials: LoginRequest
): Promise<string> {
  const response = await apiRequest<LoginResponse>(
    "/api/super-admin/login",
    {
      method: "POST",
      body: credentials,
      auth: false,
    }
  );

  const token = extractToken(response);
  if (!token) {
    throw new Error("Login succeeded but no token was returned.");
  }

  setAuthToken(token);
  return token;
}

export async function logoutSuperAdmin(): Promise<void> {
  clearAuthToken();
}
