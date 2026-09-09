import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { DashboardMetrics } from '@/components/features/dashboard/DashboardMetrics';
import { useDashboard } from '@/hooks/useDashboard';
import { getApiErrorMessage } from '@/lib/api/getApiErrorMessage';

export function AnalyticsPage() {
  const dashboard = useDashboard();

  const handleRefresh = async () => {
    const result = await dashboard.refetch();
    if (result.error) {
      toast.error(getApiErrorMessage(result.error, 'Unable to refresh analytics. Please try again.'));
      return;
    }
    toast.success('Analytics updated.');
  };

  return (
    <div className="w-full space-y-6">
      <PageHeader
        title="Analytics"
        description="Platform KPI totals from the Super Admin dashboard endpoint."
        actions={
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              void handleRefresh();
            }}
            disabled={dashboard.isFetching}
            aria-busy={dashboard.isFetching}
          >
            {dashboard.isFetching ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
            Refresh
          </Button>
        }
      />
      {dashboard.isError ? (
        <div className="space-y-3">
          <ErrorMessage
            message={getApiErrorMessage(dashboard.error, 'Unable to load analytics. Please try again.')}
          />
          <Button type="button" variant="outline" onClick={() => void dashboard.refetch()}>
            Retry
          </Button>
        </div>
      ) : (
        <DashboardMetrics metrics={dashboard.data} loading={dashboard.isLoading} />
      )}
    </div>
  );
}
