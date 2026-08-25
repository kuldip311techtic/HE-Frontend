import { useQuery } from '@tanstack/react-query';
import { DASHBOARD_QUERY_KEY } from '@/lib/api/queryKeys';
import {
  fetchDashboard,
  getDashboardErrorMessage,
} from '@/services/dashboard';
import type { DashboardQueryParams } from '@/types/dashboard';

export { getDashboardErrorMessage };

export function useDashboard(params?: DashboardQueryParams) {
  return useQuery({
    queryKey: [...DASHBOARD_QUERY_KEY, params ?? {}],
    queryFn: () => fetchDashboard(params),
  });
}
