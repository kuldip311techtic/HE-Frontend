import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@/hooks/useAuth';
import { fetchAdminUsers } from '@/lib/api/users';
import { queryKeys } from '@/lib/api/query-keys';
import { getToken } from '@/lib/auth/token-storage';
import { isAdminRole } from '@/types/auth';
import type { AdminUserRole } from '@/types/api';

interface UseUsersOptions {
  page: number;
  pageSize: number;
  search?: string;
  role?: AdminUserRole;
}

export function useUsers({ page, pageSize, search, role }: UseUsersOptions) {
  const { user, isAuthenticated, isHydrating } = useAuth();
  const hasAdminSession =
    !isHydrating && isAuthenticated && Boolean(getToken()) && Boolean(user && isAdminRole(user.role));

  return useQuery({
    queryKey: queryKeys.superAdmin.users(page, pageSize, search, role),
    queryFn: () =>
      fetchAdminUsers({
        page,
        page_size: pageSize,
        search: search || undefined,
        role,
      }),
    enabled: hasAdminSession,
  });
}
