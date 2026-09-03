import { useQuery } from "@tanstack/react-query";
import { listOrganizations } from "@/lib/api/services/admin";

/** Issues GET /v1/super-admin/organizations during Luna validation (AdminContractProbes). */
export function useOrganizationsContractProbe(enabled = false) {
  return useQuery({
    queryKey: ["contract-probe", "super-admin", "organizations"],
    queryFn: () => listOrganizations({ page: 1, page_size: 10 }),
    enabled,
    retry: false,
  });
}
