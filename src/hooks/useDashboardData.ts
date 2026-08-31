import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/api/query-keys';
import { fetchSuperAdminDashboard } from '@/services/dashboard';

export function useDashboardData() {
  return useQuery({
    queryKey: queryKeys.superAdmin.dashboard,
    queryFn: ({ signal }) => fetchSuperAdminDashboard(signal),
    staleTime: 60_000,
  });
}
