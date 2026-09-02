import { useQuery } from "@tanstack/react-query";
import { getSupportRequests } from "@/lib/api/services/admin";
import { useSuperAdminQueryEnabled } from "@/hooks/useSuperAdminQueryEnabled";
import type { ListQueryParams } from "@/types/api";

export function useSupportRequests(params: ListQueryParams) {
  const enabled = useSuperAdminQueryEnabled();

  return useQuery({
    queryKey: ["super-admin", "support-requests", params],
    queryFn: () => getSupportRequests(params),
    enabled,
  });
}
