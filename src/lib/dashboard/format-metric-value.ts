import type { DashboardAnalyticsResponse } from '@/types/api';

type DashboardMetricKey = keyof Pick<
  DashboardAnalyticsResponse,
  | 'total_organizations'
  | 'total_coaches'
  | 'total_players'
  | 'total_sessions'
  | 'active_subscriptions'
  | 'revenue_overview'
>;

export function formatDashboardMetricValue(key: DashboardMetricKey, value: number): string {
  if (key === 'revenue_overview') {
    return value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  return value.toLocaleString();
}

export function areDashboardMetricsEmpty(data: DashboardAnalyticsResponse): boolean {
  return (
    data.total_organizations === 0 &&
    data.total_coaches === 0 &&
    data.total_players === 0 &&
    data.total_sessions === 0 &&
    data.active_subscriptions === 0 &&
    data.revenue_overview === 0
  );
}
