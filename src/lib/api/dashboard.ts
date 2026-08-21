import apiRequest from './client';
import type { DashboardResponse } from '../../types/dashboard';

const DASHBOARD_ENDPOINT = '/dashboard';

export async function fetchDashboard(): Promise<DashboardResponse> {
  const response = await apiRequest<DashboardResponse>(DASHBOARD_ENDPOINT, {
    method: 'GET',
  });

  if (!response.success) {
    throw new Error(response.message || 'Unable to load dashboard metrics.');
  }

  return response;
}

export { DASHBOARD_ENDPOINT };
