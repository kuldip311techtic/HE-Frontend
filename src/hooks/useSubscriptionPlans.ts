import { useQuery } from "@tanstack/react-query";
import { listSubscriptionPlans } from "@/lib/api/services/admin";
import type { SubscriptionPlanListParams } from "@/types/api";
import { useHasLiveApiAccess } from "@/hooks/useHasLiveApiAccess";

export function useSubscriptionPlans(params: SubscriptionPlanListParams) {
  const hasLiveApiAccess = useHasLiveApiAccess();

  return useQuery({
    queryKey: ["super-admin", "subscription-plans", params],
    queryFn: () => listSubscriptionPlans(params),
    enabled: hasLiveApiAccess && Boolean(params.role),
  });
}
