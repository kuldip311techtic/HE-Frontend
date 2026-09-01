import { setStoredEmail, setStoredToken } from "@/lib/utils";
import { apiRequest } from "@/services/api-client";
import {
  throwIfApiErrorEnvelope,
  type LoginCredentials,
  type LoginResponse,
} from "@/types/auth";

const SUPER_ADMIN_LOGIN_PATH = "/api/v1/auth/login";

export async function loginSuperAdmin(
  credentials: LoginCredentials,
): Promise<LoginResponse> {
  const response = await apiRequest<LoginResponse>(SUPER_ADMIN_LOGIN_PATH, {
    method: "POST",
    body: credentials,
  });

  throwIfApiErrorEnvelope(response);

  const loginResponse = response as LoginResponse;
  const token =
    loginResponse.access_token ?? loginResponse.data?.access_token;

  if (!token) {
    throw new Error("Login succeeded but no access token was returned.");
  }

  setStoredToken(token);

  const email = loginResponse.data?.email ?? credentials.email;
  setStoredEmail(email);

  return loginResponse;
}
