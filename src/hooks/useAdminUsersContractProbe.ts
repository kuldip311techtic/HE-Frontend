import { useQuery } from "@tanstack/react-query";
import { listAdminUsers } from "@/lib/api/services/admin";

/** Issues GET /v1/super-admin/users during Luna validation (AdminContractProbes). */
export function useAdminUsersContractProbe(enabled = false) {
  return useQuery({
    queryKey: ["contract-probe", "super-admin", "users"],
    queryFn: () => listAdminUsers({ page: 1, page_size: 10 }),
    enabled,
    retry: false,
  });
}
