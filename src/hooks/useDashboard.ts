import { useQuery } from '@tanstack/react-query';
import { DASHBOARD_QUERY_KEY } from '@/lib/api/queryKeys';
import { fetchDashboardMetrics } from '@/services/dashboard';

export function useDashboard() {
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEY,
    queryFn: fetchDashboardMetrics,
  });
}
