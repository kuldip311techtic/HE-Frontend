import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@/hooks/useAuth';
import { fetchAdminUsers } from '@/lib/api/users';
import { hasAdminSession } from '@/lib/auth/admin-session';
import { queryKeys } from '@/lib/api/query-keys';
import type { AdminUserRole } from '@/types/api';

interface UseUsersOptions {
  page: number;
  pageSize: number;
  search?: string;
  role?: AdminUserRole;
}

export function useUsers({ page, pageSize, search, role }: UseUsersOptions) {
  const { user, isAuthenticated, isHydrating } = useAuth();

  return useQuery({
    queryKey: queryKeys.superAdmin.users(page, pageSize, search, role),
    queryFn: () =>
      fetchAdminUsers({
        page,
        page_size: pageSize,
        search: search || undefined,
        role,
      }),
    enabled: hasAdminSession(user, isAuthenticated, isHydrating),
  });
}
