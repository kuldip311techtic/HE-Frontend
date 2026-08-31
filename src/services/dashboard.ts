import { apiClient } from '@/lib/api/client';
import type { SuperAdminDashboardResponse } from '@/types/dashboard';

export async function fetchSuperAdminDashboard(
  signal?: AbortSignal,
): Promise<SuperAdminDashboardResponse> {
  return apiClient.get<SuperAdminDashboardResponse>(
    apiClient.paths.superAdminDashboard,
    signal,
  );
}
