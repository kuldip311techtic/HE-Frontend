import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/api/query-keys';
import { fetchDashboardData } from '@/services/dashboard';

export function useDashboardData() {
  return useQuery({
    queryKey: queryKeys.superAdmin.dashboard,
    queryFn: fetchDashboardData,
  });
}
