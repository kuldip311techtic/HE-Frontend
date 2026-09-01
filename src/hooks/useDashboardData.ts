import { useQuery } from '@tanstack/react-query';
import { fetchDashboard } from '@/lib/api/services/dashboard';
import { queryKeys } from '@/lib/api/query-keys';

export function useDashboardData() {
  return useQuery({
    queryKey: queryKeys.superAdmin.dashboard(),
    queryFn: fetchDashboard,
    staleTime: 60_000,
  });
}
