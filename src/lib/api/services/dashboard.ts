import { apiRequest } from '@/lib/api/request';
import { endpoints } from '@/lib/api/endpoints';
import { unwrapItems } from '@/lib/api/unwrapList';
import type { QuickAccessItem, QuickAccessResponse, SuperAdminDashboardMetrics } from '@/types/api';

export async function getDashboardMetrics(): Promise<SuperAdminDashboardMetrics> {
  return apiRequest<SuperAdminDashboardMetrics>(endpoints.superAdminDashboard);
}

export async function getQuickAccess(): Promise<QuickAccessResponse> {
  const data = await apiRequest<QuickAccessResponse | QuickAccessItem[]>(endpoints.quickAccess);
  return { items: unwrapItems<QuickAccessItem>(data) };
}
