import { useQuery } from '@tanstack/react-query';
import { getDashboardMetrics } from '@/lib/api/services/dashboard';
import { queryKeys } from '@/lib/api/queryKeys';

export function useDashboard() {
  return useQuery({
    queryKey: queryKeys.superAdminDashboard,
    queryFn: getDashboardMetrics,
  });
}
