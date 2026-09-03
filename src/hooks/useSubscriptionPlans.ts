import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@/hooks/useAuth';
import { fetchSubscriptionPlans } from '@/lib/api/subscription-plans';
import { queryKeys } from '@/lib/api/query-keys';
import { getToken } from '@/lib/auth/token-storage';
import { isAdminRole } from '@/types/auth';
import type { PlanStatus, SubscriptionPlanRole } from '@/types/api';

interface UseSubscriptionPlansOptions {
  role: SubscriptionPlanRole;
  page: number;
  pageSize: number;
  search?: string;
  status?: PlanStatus;
}

export function useSubscriptionPlans({
  role,
  page,
  pageSize,
  search,
  status,
}: UseSubscriptionPlansOptions) {
  const { user, isAuthenticated, isHydrating } = useAuth();
  const hasAdminSession =
    !isHydrating && isAuthenticated && Boolean(getToken()) && Boolean(user && isAdminRole(user.role));

  return useQuery({
    queryKey: queryKeys.superAdmin.subscriptionPlans(role, page, pageSize, search, status),
    queryFn: () =>
      fetchSubscriptionPlans({
        role,
        page,
        page_size: pageSize,
        search: search || undefined,
        status,
      }),
    enabled: hasAdminSession,
  });
}
