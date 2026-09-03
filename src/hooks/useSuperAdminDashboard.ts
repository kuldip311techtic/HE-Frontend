import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@/hooks/useAuth';
import { apiClient } from '@/lib/api/client';
import { queryKeys } from '@/lib/api/query-keys';
import { getToken } from '@/lib/auth/token-storage';
import { isAdminRole } from '@/types/auth';
import type { DashboardAnalyticsResponse } from '@/types/api';

async function fetchSuperAdminDashboard(): Promise<DashboardAnalyticsResponse> {
  const { data } = await apiClient.get<DashboardAnalyticsResponse>('/v1/super-admin/dashboard');
  return data;
}

export function useSuperAdminDashboard() {
  const { user, isAuthenticated, isHydrating } = useAuth();
  const hasAdminSession =
    !isHydrating && isAuthenticated && Boolean(getToken()) && Boolean(user && isAdminRole(user.role));

  return useQuery({
    queryKey: queryKeys.superAdmin.dashboard,
    queryFn: fetchSuperAdminDashboard,
    enabled: hasAdminSession,
  });
}
