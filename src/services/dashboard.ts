import { apiRequest } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/query-keys';
import type { DashboardData } from '@/types/dashboard';

export async function fetchDashboardData(): Promise<DashboardData> {
  return apiRequest<DashboardData>(API_ENDPOINTS.superAdminDashboard, {
    method: 'GET',
  });
}
