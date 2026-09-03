import { apiPost } from "@/lib/api/client";
import type { LoginResponse, SuperAdminLoginRequest } from "@/types/api";

/** Ticket path: POST /api/super-admin/login */
export async function superAdminLogin(
  body: SuperAdminLoginRequest,
): Promise<LoginResponse> {
  return apiPost<LoginResponse, SuperAdminLoginRequest>(
    "/super-admin/login",
    body,
  );
}
