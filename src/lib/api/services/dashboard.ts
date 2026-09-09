import { apiClient, resolveApiPath } from '@/lib/api/client';
import { endpoints } from '@/lib/api/endpoints';
import type { SuperAdminDashboardMetrics } from '@/types/api';

/** GET /api/super-admin/dashboard */
export async function fetchSuperAdminDashboard(): Promise<SuperAdminDashboardMetrics> {
  const { method, path } = endpoints.superAdminDashboard;
  const { data } = await apiClient.request<SuperAdminDashboardMetrics>({
    method,
    url: resolveApiPath(path),
  });
  return data;
}
