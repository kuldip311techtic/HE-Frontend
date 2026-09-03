import { useQuery } from "@tanstack/react-query";
import { listSupportRequests } from "@/lib/api/services/admin";
import type { SupportRequestListParams } from "@/types/api";
import { useHasLiveApiAccess } from "@/hooks/useHasLiveApiAccess";

/** JAW-9613: list-only hook — no respond/close mutations until contract POST/PUT routes exist. */
export function useSupportRequests(params: SupportRequestListParams) {
  const hasLiveApiAccess = useHasLiveApiAccess();

  return useQuery({
    queryKey: ["super-admin", "support-requests", params],
    queryFn: () => listSupportRequests(params),
    enabled: hasLiveApiAccess,
  });
}
