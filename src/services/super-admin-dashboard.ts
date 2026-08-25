import { apiRequest } from "@/services/api-client";
import type {
  DashboardQueryParams,
  DashboardResponse,
} from "@/types/dashboard";

const SUPER_ADMIN_DASHBOARD_PATH = "/api/super-admin/dashboard";

function buildDashboardQuery(params?: DashboardQueryParams): string {
  if (!params) {
    return "";
  }

  const searchParams = new URLSearchParams();

  if (params.start_date) {
    searchParams.set("start_date", params.start_date);
  }

  if (params.end_date) {
    searchParams.set("end_date", params.end_date);
  }

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

export async function fetchSuperAdminDashboard(
  params?: DashboardQueryParams,
): Promise<DashboardResponse> {
  return apiRequest<DashboardResponse>(
    `${SUPER_ADMIN_DASHBOARD_PATH}${buildDashboardQuery(params)}`,
    {
      method: "GET",
      auth: true,
    },
  );
}
