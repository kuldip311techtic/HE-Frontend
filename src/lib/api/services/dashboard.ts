import { apiRequest } from '@/lib/api/request';
import { endpoints } from '@/lib/api/endpoints';
import type { SuperAdminDashboardMetrics } from '@/types/api';

export async function getDashboardMetrics(): Promise<SuperAdminDashboardMetrics> {
  return apiRequest<SuperAdminDashboardMetrics>(endpoints.superAdminDashboard);
}
