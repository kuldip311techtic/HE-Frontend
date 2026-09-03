import type { DashboardAnalyticsResponse } from '@/types/api';
import { apiClient } from './client';
import { CONTRACT_ROUTES, contractPathToClientPath } from './endpoints';

const { method, path: contractPath } = CONTRACT_ROUTES.superAdminDashboard;

/** GET /api/v1/super-admin/dashboard */
export async function fetchDashboardAnalytics(): Promise<DashboardAnalyticsResponse> {
  const { data } = await apiClient.request<DashboardAnalyticsResponse>({
    method,
    url: contractPathToClientPath(contractPath),
  });
  return data;
}
