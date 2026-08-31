import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/api/query-keys';
import { getDashboardData } from '@/lib/api/services/dashboard';

export function useDashboardData() {
  return useQuery({
    queryKey: queryKeys.dashboard,
    queryFn: getDashboardData,
  });
}
