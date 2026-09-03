import { useQuery } from "@tanstack/react-query";
import { getSuperAdminDashboard } from "@/lib/api/services/admin";

/** Issues GET /v1/super-admin/dashboard during Luna validation (AdminContractProbes). */
export function useAdminDashboardContractProbe(enabled = false) {
  return useQuery({
    queryKey: ["contract-probe", "super-admin", "dashboard"],
    queryFn: getSuperAdminDashboard,
    enabled,
    retry: false,
  });
}
