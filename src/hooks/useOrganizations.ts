import { useQuery } from "@tanstack/react-query";
import { listOrganizations } from "@/lib/api/services/admin";
import type { OrganizationListParams } from "@/types/api";
import { useHasLiveApiAccess } from "@/hooks/useHasLiveApiAccess";

export function useOrganizations(params: OrganizationListParams) {
  const hasLiveApiAccess = useHasLiveApiAccess();

  return useQuery({
    queryKey: ["super-admin", "organizations", params],
    queryFn: () => listOrganizations(params),
    enabled: hasLiveApiAccess,
  });
}
