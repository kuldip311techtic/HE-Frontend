import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@/hooks/useAuth';
import { fetchOrganizations } from '@/lib/api/organizations';
import { hasAdminSession } from '@/lib/auth/admin-session';
import { queryKeys } from '@/lib/api/query-keys';

interface UseOrganizationsOptions {
  page: number;
  pageSize: number;
  search?: string;
}

export function useOrganizations({ page, pageSize, search }: UseOrganizationsOptions) {
  const { user, isAuthenticated, isHydrating } = useAuth();

  return useQuery({
    queryKey: queryKeys.superAdmin.organizations(page, pageSize, search),
    queryFn: () =>
      fetchOrganizations({
        page,
        page_size: pageSize,
        search: search || undefined,
      }),
    enabled: hasAdminSession(user, isAuthenticated, isHydrating),
  });
}
