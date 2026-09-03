import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@/hooks/useAuth';
import { apiClient } from '@/lib/api/client';
import { hasAdminSession } from '@/lib/auth/admin-session';
import { queryKeys } from '@/lib/api/query-keys';
import type { DashboardAnalyticsResponse } from '@/types/api';

async function fetchSuperAdminDashboard(): Promise<DashboardAnalyticsResponse> {
  const { data } = await apiClient.get<DashboardAnalyticsResponse>('/v1/super-admin/dashboard');
  return data;
}

export function useSuperAdminDashboard() {
  const { user, isAuthenticated, isHydrating } = useAuth();

  return useQuery({
    queryKey: queryKeys.superAdmin.dashboard,
    queryFn: fetchSuperAdminDashboard,
    enabled: hasAdminSession(user, isAuthenticated, isHydrating),
  });
}
