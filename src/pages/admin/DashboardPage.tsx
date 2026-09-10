import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { DashboardMetrics } from '@/components/features/dashboard/DashboardMetrics';
import { useDashboard } from '@/hooks/useDashboard';
import { useOrganizationAdminTeam } from '@/hooks/useOrganizationAdminTeam';
import { usePlayerRoleSelection } from '@/hooks/usePlayerRoleSelection';
import { useSession } from '@/hooks/useSession';
import { getApiErrorMessage } from '@/lib/api/getApiErrorMessage';
import { CONTRACT_PROBE_ID } from '@/lib/constants';

export function DashboardPage() {
  const dashboard = useDashboard();
  usePlayerRoleSelection();
  useOrganizationAdminTeam(CONTRACT_PROBE_ID);
  useSession(CONTRACT_PROBE_ID);

  const handleRefresh = async () => {
    const result = await dashboard.refetch();
    if (result.error) {
      toast.error(
        getApiErrorMessage(result.error, 'Unable to refresh the dashboard. Please try again.'),
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
            disabled={dashboard.isFetching}
            aria-busy={dashboard.isFetching}
          >
            {dashboard.isFetching ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
            {dashboard.isFetching ? 'Refreshing…' : 'Refresh'}
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
    </div>
  );
}
