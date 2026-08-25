import { useState } from 'react';
import { toast } from 'sonner';
import DashboardFilters from '@/components/features/dashboard/DashboardFilters';
import DashboardMetrics from '@/components/features/dashboard/DashboardMetrics';
import NavigationLinks from '@/components/features/dashboard/NavigationLinks';
import AdminLayout from '@/components/layout/AdminLayout';
import ErrorState from '@/components/shared/ErrorState';
import PageHeader from '@/components/shared/PageHeader';
import {
  getDashboardErrorMessage,
  useDashboard,
} from '@/hooks/useDashboard';
import { exportDashboardMetricsCsv } from '@/services/dashboard';
import type { DashboardQueryParams } from '@/types/dashboard';

export default function SuperAdminDashboardPage() {
  const [filters, setFilters] = useState<DashboardQueryParams>({});
  const { data, isLoading, isError, error, refetch, isFetching } =
    useDashboard(filters);

  const handleRefresh = async () => {
    try {
      await refetch();
      toast.success('Dashboard analytics refreshed successfully.');
    } catch {
      toast.error('Failed to refresh dashboard analytics.');
    }
  };

  const handleExport = () => {
    if (!data) {
      toast.error('No analytics data available to export.');
      return;
    }

    exportDashboardMetricsCsv(data);
    toast.success('Analytics data exported successfully.');
  };

  const errorMessage = isError ? getDashboardErrorMessage(error) : null;

  return (
    <AdminLayout title="Dashboard">
      <PageHeader
        title="Platform Overview"
        description="Monitor key performance metrics and navigate to core platform modules."
      />

      <DashboardFilters
        filters={filters}
        onFiltersChange={setFilters}
        onRefresh={() => {
          void handleRefresh();
        }}
        onExport={handleExport}
        refreshing={isFetching}
        exportDisabled={!data}
      />

      {errorMessage ? (
        <ErrorState
          title="Unable to load dashboard"
          message={errorMessage}
          retryLabel="Retry loading dashboard"
          onRetry={() => {
            void refetch();
          }}
        />
      ) : (
        <>
          <DashboardMetrics metrics={data} loading={isLoading} />
          {!isLoading && data ? (
            <NavigationLinks apiLinks={data.links} />
          ) : null}
        </>
      )}
    </AdminLayout>
  );
}
