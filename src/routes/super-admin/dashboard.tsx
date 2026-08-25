import { Download, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import DashboardMetrics from '@/components/features/dashboard/DashboardMetrics';
import NavigationLinks from '@/components/features/dashboard/NavigationLinks';
import AdminLayout from '@/components/layout/AdminLayout';
import ErrorState from '@/components/shared/ErrorState';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { useDashboard } from '@/hooks/useDashboard';
import { getStoredEmail } from '@/lib/auth/session';
import {
  exportDashboardMetrics,
  getDashboardErrorMessage,
} from '@/services/dashboard';

export default function SuperAdminDashboardPage() {
  const email = getStoredEmail();
  const { data, isLoading, isError, error, refetch, isFetching } =
    useDashboard();

  const handleRefresh = async () => {
    const result = await refetch();

    if (result.isError) {
      toast.error(getDashboardErrorMessage(result.error));
      return;
    }

    toast.success('Dashboard data refreshed successfully.');
  };

  const handleExport = () => {
    if (!data) {
      toast.error('No dashboard data available to export.');
      return;
    }

    exportDashboardMetrics(data);
    toast.success('Dashboard metrics exported successfully.');
  };

  const errorMessage = isError ? getDashboardErrorMessage(error) : null;

  return (
    <AdminLayout title="Dashboard">
      <PageHeader
        title="Dashboard"
        description={
          email
            ? `Welcome back, ${email}. Review platform performance and navigate to core modules.`
            : 'Review platform performance metrics and navigate to core modules.'
        }
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleExport}
              disabled={isLoading || !data}
              aria-label="Export dashboard analytics data"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Export
            </Button>
            <Button
              type="button"
              onClick={() => {
                void handleRefresh();
              }}
              disabled={isFetching}
              aria-label="Refresh dashboard metrics"
            >
              <RefreshCw
                className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`}
                aria-hidden="true"
              />
              Refresh
            </Button>
          </div>
        }
      />

      {isError ? (
        <ErrorState
          title="Unable to load dashboard"
          message={errorMessage ?? 'Something went wrong. Please try again.'}
          retryLabel="Retry loading dashboard"
          onRetry={() => {
            void refetch();
          }}
        />
      ) : (
        <div className="space-y-10">
          <DashboardMetrics metrics={data} loading={isLoading} />
          <NavigationLinks apiLinks={data?.links} loading={isLoading} />
        </div>
      )}
    </AdminLayout>
  );
}
