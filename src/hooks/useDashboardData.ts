import { useQuery } from '@tanstack/react-query';
import { fetchDashboard } from '../lib/api/dashboard';
import { DASHBOARD_QUERY_KEY } from '../lib/api/queryKeys';
import { ApiError } from '../types/api';

const DEFAULT_DASHBOARD_ERROR = 'Unable to load dashboard metrics.';
const NETWORK_DASHBOARD_ERROR =
  'Unable to load dashboard data. Check your connection and try again.';

export function getDashboardErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message || DEFAULT_DASHBOARD_ERROR;
  }

  if (error instanceof TypeError) {
    return NETWORK_DASHBOARD_ERROR;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return DEFAULT_DASHBOARD_ERROR;
}

export function useDashboardData() {
  const query = useQuery({
    queryKey: DASHBOARD_QUERY_KEY,
    queryFn: fetchDashboard,
  });

  return {
    data: query.data?.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    isSuccess: query.isSuccess,
    isEmpty:
      query.isSuccess &&
      (query.data?.data.metrics.length ?? 0) === 0,
    error: query.error ? getDashboardErrorMessage(query.error) : null,
    refetch: query.refetch,
  };
}
