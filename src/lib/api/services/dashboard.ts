import { apiClient } from '@/lib/api/client';
import type { DashboardData } from '@/types';

const DASHBOARD_PATH = '/api/v1/super-admin/dashboard';

export async function getDashboardData(): Promise<DashboardData> {
  return apiClient.get<DashboardData>(DASHBOARD_PATH);
}
