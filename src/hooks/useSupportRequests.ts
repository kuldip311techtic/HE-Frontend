import { useQuery } from "@tanstack/react-query";
import { listSupportRequests } from "@/lib/api/services/admin";
import type { SupportRequestListParams } from "@/types/api";
import { useHasLiveApiAccess } from "@/hooks/useHasLiveApiAccess";

export function useSupportRequests(params: SupportRequestListParams) {
  const hasLiveApiAccess = useHasLiveApiAccess();

  return useQuery({
    queryKey: ["super-admin", "support-requests", params],
    queryFn: () => listSupportRequests(params),
    enabled: hasLiveApiAccess,
  });
}
