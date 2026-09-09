import { useQuery } from '@tanstack/react-query';
import { fetchSuperAdminDashboard } from '@/lib/api/services/dashboard';
import { queryKeys } from '@/lib/api/queryKeys';

export function useSuperAdminDashboard(enabled = true) {
  return useQuery({
    queryKey: queryKeys.superAdminDashboard,
    queryFn: fetchSuperAdminDashboard,
    enabled,
  });
}
