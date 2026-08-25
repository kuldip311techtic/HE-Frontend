import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/api/query-keys";
import { fetchSuperAdminDashboard } from "@/services/super-admin-dashboard";
import type { DashboardQueryParams } from "@/types/dashboard";

export function useDashboard(params?: DashboardQueryParams) {
  return useQuery({
    queryKey: [...queryKeys.superAdmin.dashboard, params ?? {}],
    queryFn: () => fetchSuperAdminDashboard(params),
  });
}
