import { apiRequest } from "@/services/api-client";
import type { DashboardResponse } from "@/types/super-admin";

export async function getDashboard(): Promise<DashboardResponse> {
  return apiRequest<DashboardResponse>("/api/v1/super-admin/dashboard", {
    method: "GET",
  });
}
