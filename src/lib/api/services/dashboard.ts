import { apiClient, apiPaths } from '@/lib/api/client';
import type { DashboardData } from '@/types';

export async function fetchDashboard(): Promise<DashboardData> {
  return apiClient<DashboardData>(apiPaths.superAdminDashboard);
}
