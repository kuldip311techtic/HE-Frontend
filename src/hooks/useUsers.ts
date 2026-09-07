import { useQuery } from '@tanstack/react-query';
import { fetchUsers } from '@/lib/api/users';
import { queryKeys } from '@/lib/api/query-keys';
import { useAdminAuth } from '@/lib/auth/AdminAuthProvider';
import type { UserListParams } from '@/types/users';

export function useUsers(params: UserListParams) {
  const { canFetchAdminData } = useAdminAuth();

  return useQuery({
    queryKey: queryKeys.superAdmin.users({
      page: params.page,
      page_size: params.page_size,
      search: params.search ?? null,
      role: params.role ?? null,
    }),
    queryFn: () => fetchUsers(params),
    enabled: canFetchAdminData,
    staleTime: 30_000,
  });
}
