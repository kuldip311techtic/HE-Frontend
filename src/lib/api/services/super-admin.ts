import { apiGet } from "@/lib/api/client";
import type { SuperAdminDashboard } from "@/types/api";

/** Live OpenAPI: GET /api/v1/super-admin/dashboard */
export async function getSuperAdminDashboard(): Promise<SuperAdminDashboard> {
  return apiGet("/v1/super-admin/dashboard");
}
