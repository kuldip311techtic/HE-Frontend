import { useCallback, useEffect, useState } from 'react';
import { api, getApiErrorMessage } from '@/lib/api';
import { API_PATHS } from '@/lib/api/endpoints';
import { getSession, isDevBypassToken } from '@/lib/auth/session';
import type { DashboardAnalyticsResponse } from '@/types/api';

const EMPTY_DASHBOARD: DashboardAnalyticsResponse = {
  total_organizations: 0,
  total_coaches: 0,
  total_players: 0,
  total_sessions: 0,
  active_subscriptions: 0,
  revenue_overview: 0,
};

export function useDashboard() {
  const [data, setData] = useState<DashboardAnalyticsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (mode: 'initial' | 'refresh' = 'initial') => {
    if (mode === 'refresh') {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    if (isDevBypassToken(getSession()?.token)) {
      setData(EMPTY_DASHBOARD);
      setIsLoading(false);
      setIsRefreshing(false);
      return;
    }

    try {
      const response = await api.get<DashboardAnalyticsResponse>(API_PATHS.dashboard);
      setData(response);
    } catch (err) {
      if (mode !== 'refresh') {
        setData(null);
      }
      setError(getApiErrorMessage(err, 'Unable to load dashboard. Please try again.'));
      throw err;
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void load('initial').catch(() => {
      /* error is stored in state */
    });
  }, [load]);

  const refresh = useCallback(() => load('refresh'), [load]);

  return { data, isLoading, isRefreshing, error, reload: load, refresh };
}
