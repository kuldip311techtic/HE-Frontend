import { useQuery } from '@tanstack/react-query';
import { fetchDashboardAnalytics } from '@/lib/api/dashboard';
import { queryKeys } from '@/lib/api/query-keys';
import { useAdminAuth } from '@/lib/auth/AdminAuthProvider';

export function useDashboardAnalytics() {
  const { canFetchAdminData } = useAdminAuth();

  return useQuery({
    queryKey: queryKeys.superAdmin.dashboard,
    queryFn: fetchDashboardAnalytics,
    enabled: canFetchAdminData,
    staleTime: 60_000,
  });
}
