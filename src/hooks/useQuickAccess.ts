import { useQuery } from '@tanstack/react-query';
import { fetchQuickAccess } from '@/lib/api/quick-access';
import { queryKeys } from '@/lib/api/query-keys';
import { useAdminAuth } from '@/lib/auth/AdminAuthProvider';

export function useQuickAccess() {
  const { isAuthenticated, isAdmin, isHydrating } = useAdminAuth();

  return useQuery({
    queryKey: queryKeys.superAdmin.quickAccess,
    queryFn: fetchQuickAccess,
    enabled: !isHydrating && isAuthenticated && isAdmin,
    staleTime: 60_000,
    retry: 1,
  });
}
