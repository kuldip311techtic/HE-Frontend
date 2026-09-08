import { describe, expect, it } from 'vitest';
import {
  areDashboardMetricsEmpty,
  formatDashboardMetricValue,
} from '@/lib/dashboard/format-metric-value';
import type { DashboardAnalyticsResponse } from '@/types/api';

const sampleMetrics: DashboardAnalyticsResponse = {
  total_organizations: 12,
  total_coaches: 45,
  total_players: 320,
  total_sessions: 890,
  active_subscriptions: 18,
  revenue_overview: 12500.5,
  description: null,
  link: null,
  error: null,
};

describe('formatDashboardMetricValue', () => {
  it('formats revenue as currency using the platform default', () => {
    const formatted = formatDashboardMetricValue('revenue_overview', 12500.5);
    expect(formatted).toMatch(/\$12,500\.50|12\.500,50\s*\$/);
  });

  it('formats count metrics with locale grouping', () => {
    expect(formatDashboardMetricValue('total_players', 320)).toBe('320');
  });
});

describe('areDashboardMetricsEmpty', () => {
  it('returns true when all metrics are zero', () => {
    expect(
      areDashboardMetricsEmpty({
        ...sampleMetrics,
        total_organizations: 0,
        total_coaches: 0,
        total_players: 0,
        total_sessions: 0,
        active_subscriptions: 0,
        revenue_overview: 0,
      }),
    ).toBe(true);
  });

  it('returns false when any metric is non-zero', () => {
    expect(areDashboardMetricsEmpty(sampleMetrics)).toBe(false);
  });
});
