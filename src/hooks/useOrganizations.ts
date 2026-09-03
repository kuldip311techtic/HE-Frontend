import { useQuery } from '@tanstack/react-query';
import { fetchOrganizations } from '@/lib/api/organizations';
import { queryKeys } from '@/lib/api/query-keys';
import { useAdminAuth } from '@/lib/auth/AdminAuthProvider';
import type { OrganizationListParams } from '@/types/organizations';

export function useOrganizations(params: OrganizationListParams) {
  const { isAuthenticated, isAdmin, isHydrating } = useAdminAuth();

  return useQuery({
    queryKey: queryKeys.superAdmin.organizations({
      page: params.page,
      page_size: params.page_size,
      search: params.search ?? null,
    }),
    queryFn: () => fetchOrganizations(params),
    enabled: !isHydrating && isAuthenticated && isAdmin,
    staleTime: 30_000,
  });
}
