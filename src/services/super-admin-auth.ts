import { setStoredEmail, setStoredToken } from "@/lib/utils";
import { apiRequest } from "@/services/api-client";
import type {
  LoginCredentials,
  LoginResponse,
} from "@/types/auth";

const SUPER_ADMIN_LOGIN_PATH = "/api/super-admin/login";

export async function loginSuperAdmin(
  credentials: LoginCredentials,
): Promise<LoginResponse> {
  const response = await apiRequest<LoginResponse>(SUPER_ADMIN_LOGIN_PATH, {
    method: "POST",
    body: credentials,
  });

  const token =
    response.data?.access_token ||
    response.data?.token ||
    response.token;

  if (token) {
    setStoredToken(token);
  }

  const email = response.data?.email || response.email;
  if (email) {
    setStoredEmail(email);
  }

  return response;
}
