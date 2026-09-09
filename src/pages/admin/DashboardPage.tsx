import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { DashboardMetrics } from '@/components/features/dashboard/DashboardMetrics';
import { DashboardModuleNav } from '@/components/features/dashboard/DashboardModuleNav';
import { QuickAccessSection } from '@/components/features/dashboard/QuickAccessSection';
import { useDashboard, useQuickAccess } from '@/hooks/useDashboard';
import { getApiErrorMessage } from '@/lib/api/getApiErrorMessage';

export function DashboardPage() {
  const dashboard = useDashboard();
  const quickAccess = useQuickAccess();

  const isRefreshing = dashboard.isFetching || quickAccess.isFetching;

  const handleRefresh = async () => {
    const [dashboardResult, quickAccessResult] = await Promise.all([
      dashboard.refetch(),
      quickAccess.refetch(),
    ]);
    if (dashboardResult.error || quickAccessResult.error) {
      toast.error(
        getApiErrorMessage(
          dashboardResult.error ?? quickAccessResult.error,
          'Unable to refresh the dashboard. Please try again.',
        ),
      );
      return;
    }
    toast.success('Dashboard updated.');
  };

  return (
    <div className="admin-dashboard-page w-full space-y-6">
      <PageHeader
        title="Super Admin Dashboard"
        description="Platform totals for organizations, coaches, players, sessions, subscriptions, and revenue."
        actions={
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              void handleRefresh();
            }}
            disabled={isRefreshing}
            aria-busy={isRefreshing}
          >
            {isRefreshing ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
            {isRefreshing ? 'Refreshing…' : 'Refresh'}
          </Button>
        }
      />
      {dashboard.isError ? (
        <div className="space-y-3">
          <ErrorMessage
            message={getApiErrorMessage(
              dashboard.error,
              'Unable to load dashboard metrics. Please try again.',
            )}
          />
          <Button type="button" variant="outline" onClick={() => void dashboard.refetch()}>
            Retry
          </Button>
        </div>
      ) : (
        <DashboardMetrics metrics={dashboard.data} loading={dashboard.isLoading} />
      )}
      <DashboardModuleNav loading={dashboard.isLoading} />
      <QuickAccessSection
        items={quickAccess.data?.items ?? []}
        loading={quickAccess.isLoading}
        error={
          quickAccess.isError
            ? getApiErrorMessage(
                quickAccess.error,
                'Unable to load quick access. Please try again.',
              )
            : null
        }
        onRetry={() => void quickAccess.refetch()}
      />
    </div>
  );
}
