import { useQuery } from "@tanstack/react-query";
import { getSuperAdminDashboard } from "@/lib/api/services/admin";

export function useAdminDashboard(enabled = true) {
  return useQuery({
    queryKey: ["super-admin", "dashboard"],
    queryFn: getSuperAdminDashboard,
    enabled,
    retry: false,
  });
}
