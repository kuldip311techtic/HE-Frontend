import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/api/query-keys";
import { fetchSuperAdminDashboard } from "@/services/super-admin-dashboard";

export function useDashboard() {
  return useQuery({
    queryKey: queryKeys.superAdmin.dashboard,
    queryFn: fetchSuperAdminDashboard,
  });
}
