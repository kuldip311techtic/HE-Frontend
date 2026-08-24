import { apiRequest } from "@/services/api-client";
import type { DashboardResponse } from "@/types/dashboard";

const SUPER_ADMIN_DASHBOARD_PATH = "/api/super-admin/dashboard";

export async function fetchSuperAdminDashboard(): Promise<DashboardResponse> {
  return apiRequest<DashboardResponse>(SUPER_ADMIN_DASHBOARD_PATH, {
    method: "GET",
    auth: true,
  });
}
