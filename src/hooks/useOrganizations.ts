import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@/hooks/useAuth';
import { fetchOrganizations } from '@/lib/api/organizations';
import { queryKeys } from '@/lib/api/query-keys';
import { getToken } from '@/lib/auth/token-storage';
import { isAdminRole } from '@/types/auth';

interface UseOrganizationsOptions {
  page: number;
  pageSize: number;
  search?: string;
}

export function useOrganizations({ page, pageSize, search }: UseOrganizationsOptions) {
  const { user, isAuthenticated, isHydrating } = useAuth();
  const hasAdminSession =
    !isHydrating && isAuthenticated && Boolean(getToken()) && Boolean(user && isAdminRole(user.role));

  return useQuery({
    queryKey: queryKeys.superAdmin.organizations(page, pageSize, search),
    queryFn: () =>
      fetchOrganizations({
        page,
        page_size: pageSize,
        search: search || undefined,
      }),
    enabled: hasAdminSession,
  });
}
