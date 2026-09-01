import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/api/query-keys";
import { fetchSubscriptions } from "@/services/super-admin-subscriptions";

export function useSubscriptionPlans() {
  return useQuery({
    queryKey: queryKeys.superAdmin.subscriptions,
    queryFn: fetchSubscriptions,
  });
}
