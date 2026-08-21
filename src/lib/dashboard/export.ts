import type { DateRange } from './dateRange';
import { formatDateRangeLabel } from './dateRange';
import {
  formatMetricValue,
  orderDashboardMetrics,
  type OrderedDashboardMetric,
} from './metrics';
import type { DashboardData } from '../../types/dashboard';

function escapeCsvValue(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }

  return value;
}

function metricValueForExport(metric: OrderedDashboardMetric): string {
  if (metric.value === null) {
    return '—';
  }

  return formatMetricValue({
    key: metric.key,
    label: metric.label,
    value: metric.value,
  });
}

export function buildDashboardCsv(
  data: DashboardData,
  dateRange: DateRange,
  exportedAt = new Date(),
): string {
  const orderedMetrics = orderDashboardMetrics(data);
  const rows = [
    ['Reporting period', formatDateRangeLabel(dateRange)],
    ['Updated at', new Date(data.updated_at).toISOString()],
    ['Exported at', exportedAt.toISOString()],
    [],
    ['Metric', 'Value'],
    ...orderedMetrics.map((metric) => [
      metric.label,
      metricValueForExport(metric),
    ]),
  ];

  return rows
    .map((row) => row.map((cell) => escapeCsvValue(cell)).join(','))
    .join('\n');
}

export function downloadDashboardCsv(
  data: DashboardData,
  dateRange: DateRange,
): void {
  const csv = buildDashboardCsv(data, dateRange);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `hoops-engine-dashboard-${dateRange.startDate}-to-${dateRange.endDate}.csv`;
  anchor.style.display = 'none';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
