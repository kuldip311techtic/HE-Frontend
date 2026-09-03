import { useQuery } from '@tanstack/react-query';
import { fetchSubscriptionPlans } from '@/lib/api/subscription-plans';
import { queryKeys } from '@/lib/api/query-keys';
import { useAdminAuth } from '@/lib/auth/AdminAuthProvider';
import type { SubscriptionPlanListParams } from '@/types/subscriptions';

export function useSubscriptionPlans(params: SubscriptionPlanListParams) {
  const { isAuthenticated, isAdmin, isHydrating } = useAdminAuth();

  return useQuery({
    queryKey: queryKeys.superAdmin.subscriptionPlans(params.role, {
      page: params.page,
      page_size: params.page_size,
      status: params.status ?? null,
      billing_frequency: params.billing_frequency ?? null,
      search: params.search ?? null,
    }),
    queryFn: () => fetchSubscriptionPlans(params),
    enabled: !isHydrating && isAuthenticated && isAdmin,
    staleTime: 30_000,
  });
}
