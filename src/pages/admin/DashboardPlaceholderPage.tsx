import * as React from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { DashboardMetricsTable } from '@/components/features/dashboard/DashboardMetricsTable';
import { useSuperAdminDashboard } from '@/hooks/useSuperAdminDashboard';
import type { DashboardMetricRow } from '@/types/api';

export function DashboardPlaceholderPage() {
  const { data, isLoading, isError, refetch } = useSuperAdminDashboard();

  const rows = React.useMemo<DashboardMetricRow[]>(() => {
    if (!data) return [];
    return [{ id: 'platform-overview', ...data }];
  }, [data]);

  return (
    <div className="admin-dashboard-page w-full space-y-6">
      <PageHeader
        title="Super Admin Dashboard"
        description="Platform-wide analytics overview for organizations, users, sessions, and revenue."
      />
      <DashboardMetricsTable
        rows={rows}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => {
          void refetch();
        }}
      />
    </div>
  );
}
