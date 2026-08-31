import { apiClient, setAuthToken, toClientPath } from "@/services/api-client";
import type { LoginRequest, LoginResponse } from "@/types/auth";

const SUPER_ADMIN_LOGIN_PATH = "/api/super-admin/login";

export async function login(credentials: LoginRequest): Promise<string> {
  const response = await apiClient<LoginResponse>(toClientPath(SUPER_ADMIN_LOGIN_PATH), {
    method: "POST",
    body: credentials,
    auth: false,
  });

  const token = response.token ?? response.access_token;
  if (!token) {
    throw new Error("Login succeeded but no token was returned");
  }

  setAuthToken(token);
  return token;
}
