import { apiPost } from "@/lib/api/client";
import type { LoginResponse, SuperAdminLoginRequest } from "@/types/api";

/** Contract: POST /api/super-admin/login */
export async function postAuthLogin(
  body: SuperAdminLoginRequest,
): Promise<LoginResponse> {
  return apiPost<LoginResponse, SuperAdminLoginRequest>(
    "/super-admin/login",
    body,
  );
}
