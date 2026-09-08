import {
  Activity,
  Building2,
  CreditCard,
  DollarSign,
  PlayCircle,
  RefreshCw,
  Users,
} from 'lucide-react';
import { toast } from 'sonner';
import { ModuleNavCards } from '@/components/features/dashboard/ModuleNavCards';
import { MetricCard } from '@/components/features/dashboard/MetricCard';
import { QuickAccessNav } from '@/components/features/dashboard/QuickAccessNav';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { LoadingState } from '@/components/ui/loading-state';
import { Skeleton } from '@/components/ui/skeleton';
import { useDashboardAnalytics } from '@/hooks/useDashboardAnalytics';
import { useAdminAuth } from '@/lib/auth/AdminAuthProvider';
import { getUserDisplayName } from '@/lib/auth/roles';
import {
  areDashboardMetricsEmpty,
  formatDashboardMetricValue,
} from '@/lib/dashboard/format-metric-value';
import { getApiErrorMessage } from '@/lib/utils/errors';

const metricConfig = [
  { key: 'total_organizations' as const, label: 'Total Organizations', icon: Building2 },
  { key: 'total_coaches' as const, label: 'Total Coaches', icon: Users },
  { key: 'total_players' as const, label: 'Total Players', icon: Activity },
  { key: 'total_sessions' as const, label: 'Total Sessions', icon: PlayCircle },
  { key: 'active_subscriptions' as const, label: 'Active Subscriptions', icon: CreditCard },
  { key: 'revenue_overview' as const, label: 'Revenue Overview', icon: DollarSign },
];

export function AdminDashboardPage() {
  const { user, isHydrating } = useAdminAuth();
  const { data, isLoading, isError, error, refetch, isFetching } = useDashboardAnalytics();

  const handleRefresh = async () => {
    const result = await refetch();
    if (result.isSuccess) {
      toast.success('Dashboard refreshed.');
      return;
    }
    if (result.isError) {
      toast.error(
        getApiErrorMessage(result.error, 'Unable to refresh dashboard. Please try again.'),
      );
    }
  };

  if (isHydrating) {
    return <LoadingState message="Loading dashboard…" fullPage />;
  }

  const metricsEmpty = data ? areDashboardMetricsEmpty(data) : false;

  return (
    <div className="admin-dashboard-page">
      <div className="admin-dashboard-page__glow" aria-hidden="true" />
      <div className="admin-dashboard-page__inner">
        <header className="admin-dashboard-page__header">
          <div>
            <h1 className="admin-dashboard-page__title">Dashboard</h1>
            <p className="admin-dashboard-page__description">
              Platform overview and key metrics for Hoops Engine.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={handleRefresh}
            isLoading={isFetching}
            disabled={isFetching}
            aria-label="Refresh dashboard metrics"
            className="admin-outline-btn shrink-0"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            {isFetching ? 'Refreshing…' : 'Refresh'}
          </Button>
        </header>

        <Card className="dashboard-welcome-card">
          <CardHeader>
            <CardTitle>Welcome back{user ? `, ${getUserDisplayName(user)}` : ''}</CardTitle>
            <CardDescription>
              {data?.description ??
                'Your Super Admin dashboard is ready. Use the navigation to manage platform resources.'}
            </CardDescription>
          </CardHeader>
        </Card>

        <QuickAccessNav />

        {isLoading ? (
          <div className="dashboard-metrics-grid" aria-busy="true" aria-label="Loading metrics">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="dashboard-metric-card">
                <CardHeader className="space-y-3">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-16" />
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : null}

        {isError ? (
          <EmptyState
            title="Unable to load dashboard metrics"
            description={getApiErrorMessage(
              error,
              'Unable to load dashboard data. Please try again.',
            )}
            action={
              <Button
                onClick={handleRefresh}
                isLoading={isFetching}
                disabled={isFetching}
                className="admin-outline-btn"
              >
                {isFetching ? 'Retrying…' : 'Retry'}
              </Button>
            }
          />
        ) : null}

        {!isLoading && !isError && data && !metricsEmpty ? (
          <div className="dashboard-metrics-grid" aria-label="Dashboard metrics">
            {metricConfig.map(({ key, label, icon }) => (
              <MetricCard
                key={key}
                label={label}
                icon={icon}
                value={formatDashboardMetricValue(key, data[key])}
              />
            ))}
          </div>
        ) : null}

        {!isLoading && !isError && data && metricsEmpty ? (
          <EmptyState
            title="Dashboard ready"
            description="Metrics will appear here once analytics data is available."
            action={
              <Button
                onClick={handleRefresh}
                isLoading={isFetching}
                disabled={isFetching}
                className="admin-outline-btn"
              >
                {isFetching ? 'Refreshing…' : 'Refresh'}
              </Button>
            }
          />
        ) : null}

        {!isLoading && !isError && !data ? (
          <EmptyState
            title="Dashboard ready"
            description="Metrics will appear here once analytics data is available."
            action={
              <Button
                onClick={handleRefresh}
                isLoading={isFetching}
                disabled={isFetching}
                className="admin-outline-btn"
              >
                {isFetching ? 'Refreshing…' : 'Refresh'}
              </Button>
            }
          />
        ) : null}

        <ModuleNavCards />
      </div>
    </div>
  );
}
