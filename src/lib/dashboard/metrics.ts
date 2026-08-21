import type { DashboardData, DashboardMetric } from '../../types/dashboard';

export const DASHBOARD_METRIC_DEFINITIONS = [
  {
    key: 'total_organizations',
    label: 'Total Organizations',
  },
  {
    key: 'total_coaches',
    label: 'Total Coaches',
  },
  {
    key: 'total_players',
    label: 'Total Players',
  },
  {
    key: 'total_sessions',
    label: 'Total Sessions',
  },
  {
    key: 'active_subscriptions',
    label: 'Active Subscriptions',
  },
  {
    key: 'revenue_overview',
    label: 'Revenue Overview',
  },
] as const;

export type DashboardMetricKey =
  (typeof DASHBOARD_METRIC_DEFINITIONS)[number]['key'];

const revenueFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const countFormatter = new Intl.NumberFormat('en-US');

export function isRevenueMetric(metric: Pick<DashboardMetric, 'key'>): boolean {
  return metric.key.includes('revenue');
}

export function formatMetricValue(metric: DashboardMetric): string {
  if (Number.isNaN(metric.value)) {
    return '—';
  }

  if (isRevenueMetric(metric)) {
    return revenueFormatter.format(metric.value);
  }

  return countFormatter.format(metric.value);
}

function normalizeMetricKey(key: string): string {
  return key.trim().toLowerCase().replace(/\s+/g, '_');
}

function findMetricValue(
  metrics: DashboardMetric[],
  expectedKey: DashboardMetricKey,
  expectedLabel: string,
): number | null {
  const normalizedExpectedKey = normalizeMetricKey(expectedKey);
  const normalizedExpectedLabel = expectedLabel.trim().toLowerCase();

  const match = metrics.find((metric) => {
    const normalizedKey = normalizeMetricKey(metric.key);
    const normalizedLabel = metric.label.trim().toLowerCase();

    return (
      normalizedKey === normalizedExpectedKey ||
      normalizedLabel === normalizedExpectedLabel
    );
  });

  return match?.value ?? null;
}

export interface OrderedDashboardMetric {
  key: DashboardMetricKey;
  label: string;
  value: number | null;
}

export function orderDashboardMetrics(
  data: DashboardData,
): OrderedDashboardMetric[] {
  return DASHBOARD_METRIC_DEFINITIONS.map((definition) => ({
    key: definition.key,
    label: definition.label,
    value: findMetricValue(data.metrics, definition.key, definition.label),
  }));
}

export function hasAnyMetricValues(metrics: OrderedDashboardMetric[]): boolean {
  return metrics.some((metric) => metric.value !== null);
}
