import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@/hooks/useAuth';
import { fetchSupportRequests } from '@/lib/api/support-requests';
import { queryKeys } from '@/lib/api/query-keys';
import { getToken } from '@/lib/auth/token-storage';
import { isAdminRole } from '@/types/auth';

interface UseSupportRequestsOptions {
  page: number;
  pageSize: number;
  search?: string;
}

export function useSupportRequests({ page, pageSize, search }: UseSupportRequestsOptions) {
  const { user, isAuthenticated, isHydrating } = useAuth();
  const hasAdminSession =
    !isHydrating && isAuthenticated && Boolean(getToken()) && Boolean(user && isAdminRole(user.role));

  return useQuery({
    queryKey: queryKeys.superAdmin.supportRequests(page, pageSize, search),
    queryFn: () =>
      fetchSupportRequests({
        page,
        page_size: pageSize,
        search: search || undefined,
      }),
    enabled: hasAdminSession,
  });
}
