import axios from 'axios';
import apiClient from '@/lib/api/client';
import type { ErrorResponse } from '@/types/api';
import type { DashboardMetrics, DashboardResponse } from '@/types/dashboard';

const DASHBOARD_PATH = '/super-admin/dashboard';

export async function fetchDashboardMetrics(): Promise<DashboardMetrics> {
  const { data } = await apiClient.get<DashboardResponse>(DASHBOARD_PATH);

  if (!data.success) {
    throw new Error(data.message || 'Failed to load dashboard metrics.');
  }

  return data.data;
}

export function getDashboardErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ErrorResponse>(error)) {
    if (!error.response) {
      return 'Unable to reach the server. Check your connection and try again.';
    }

    return error.response.data?.message ?? 'Something went wrong. Please try again.';
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'Something went wrong. Please try again.';
}

export function exportDashboardMetrics(metrics: DashboardMetrics): void {
  const rows = [
    ['Metric', 'Value'],
    ['Total Organizations', String(metrics.total_organizations)],
    ['Total Coaches', String(metrics.total_coaches)],
    ['Total Players', String(metrics.total_players)],
    ['Total Sessions', String(metrics.total_sessions)],
    ['Active Subscriptions', String(metrics.active_subscriptions)],
    ['Revenue Overview', String(metrics.revenue_overview)],
  ];

  const csv = rows.map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `dashboard-metrics-${new Date().toISOString().slice(0, 10)}.csv`;
  anchor.click();
  URL.revokeObjectURL(url);
}
