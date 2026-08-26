import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '../lib/api/client';
import { DashboardResponse } from '../types/dashboard';

export const useAdminDashboardData = () => {
  return useQuery(['super-admin', 'dashboard'], async () => {
    const response = await apiRequest<DashboardResponse>('/api/super-admin/dashboard');
    if (!response.success) {
      throw new Error(response.message);
    }
    return response.data;
  });
};
