export interface DashboardMetric {
  label: string;
  value: number | string;
  change?: string;
}

export interface DashboardActivity {
  id: string;
  title: string;
  description?: string;
  timestamp?: string;
}

export interface SuperAdminDashboardResponse {
  total_organizations?: number;
  total_users?: number;
  active_sessions?: number;
  pending_verifications?: number;
  metrics?: DashboardMetric[];
  recent_activity?: DashboardActivity[];
  summary?: Record<string, number | string>;
}

export function isDashboardEmpty(data: SuperAdminDashboardResponse | undefined): boolean {
  if (!data) {
    return true;
  }

  const hasScalars =
    data.total_organizations != null ||
    data.total_users != null ||
    data.active_sessions != null ||
    data.pending_verifications != null;

  const hasMetrics = (data.metrics?.length ?? 0) > 0;
  const hasActivity = (data.recent_activity?.length ?? 0) > 0;
  const hasSummary = data.summary != null && Object.keys(data.summary).length > 0;

  return !hasScalars && !hasMetrics && !hasActivity && !hasSummary;
}
