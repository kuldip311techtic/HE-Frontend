import { useQuery } from '@tanstack/react-query';
import { getDashboardMetrics, getQuickAccess } from '@/lib/api/services/dashboard';
import { queryKeys } from '@/lib/api/queryKeys';

export function useDashboard() {
  return useQuery({
    queryKey: queryKeys.superAdminDashboard,
    queryFn: getDashboardMetrics,
  });
}

export function useQuickAccess() {
  return useQuery({
    queryKey: queryKeys.quickAccess,
    queryFn: getQuickAccess,
  });
}
