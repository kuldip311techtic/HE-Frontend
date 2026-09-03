import { useQuery } from '@tanstack/react-query';
import { fetchDashboardAnalytics } from '@/lib/api/dashboard';
import { queryKeys } from '@/lib/api/query-keys';
import { useAdminAuth } from '@/lib/auth/AdminAuthProvider';

export function useDashboardAnalytics() {
  const { isAuthenticated, isAdmin, isHydrating } = useAdminAuth();

  return useQuery({
    queryKey: queryKeys.superAdmin.dashboard,
    queryFn: fetchDashboardAnalytics,
    enabled: !isHydrating && isAuthenticated && isAdmin,
    staleTime: 60_000,
  });
}
