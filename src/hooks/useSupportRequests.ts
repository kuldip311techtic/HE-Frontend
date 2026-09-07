import { useQuery } from '@tanstack/react-query';
import { fetchSupportRequests } from '@/lib/api/support-requests';
import { queryKeys } from '@/lib/api/query-keys';
import { useAdminAuth } from '@/lib/auth/AdminAuthProvider';
import type { SupportRequestListParams } from '@/types/support-requests';

export function useSupportRequests(params: SupportRequestListParams) {
  const { canFetchAdminData } = useAdminAuth();

  return useQuery({
    queryKey: queryKeys.superAdmin.supportRequests({
      page: params.page,
      page_size: params.page_size,
      search: params.search ?? null,
      status: params.status ?? null,
    }),
    queryFn: () => fetchSupportRequests(params),
    enabled: canFetchAdminData,
    staleTime: 30_000,
  });
}
