import { useCallback, useEffect, useState } from 'react';
import { fetchDashboard } from '@/lib/api/superAdmin';
import { ApiError, getApiErrorMessage } from '@/lib/api';
import type { SuperAdminDashboardResponse } from '@/types/api';

export function useDashboard() {
  const [data, setData] = useState<SuperAdminDashboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isNotFound, setIsNotFound] = useState(false);

  const refetch = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    setIsNotFound(false);
    try {
      const response = await fetchDashboard();
      setData(response);
      return true;
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        setData(null);
        setIsNotFound(true);
        return false;
      }
      setError(getApiErrorMessage(err, 'Unable to load dashboard metrics.'));
      setData(null);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { data, isLoading, error, isNotFound, refetch };
}
