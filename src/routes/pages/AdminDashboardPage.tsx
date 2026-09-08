import {
  Building2,
  CreditCard,
  RefreshCw,
  TrendingUp,
  Users,
  Activity,
} from 'lucide-react';
import { toast } from 'sonner';
import { ModuleNavCards } from '@/components/features/dashboard/ModuleNavCards';
import { QuickAccessNav } from '@/components/features/dashboard/QuickAccessNav';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { LoadingState } from '@/components/ui/loading-state';
import { Skeleton } from '@/components/ui/skeleton';
import { useDashboardAnalytics } from '@/hooks/useDashboardAnalytics';
import { useAdminAuth } from '@/lib/auth/AdminAuthProvider';
import { getUserDisplayName } from '@/lib/auth/roles';
import { getApiErrorMessage } from '@/lib/utils/errors';
import '@/theme/admin-dashboard.css';

const metricConfig = [
  { key: 'total_organizations' as const, label: 'Total Organizations', icon: Building2 },
  { key: 'total_coaches' as const, label: 'Total Coaches', icon: Users },
  { key: 'total_players' as const, label: 'Total Players', icon: Activity },
  { key: 'total_sessions' as const, label: 'Total Sessions', icon: TrendingUp },
  { key: 'active_subscriptions' as const, label: 'Active Subscriptions', icon: CreditCard },
  { key: 'revenue_overview' as const, label: 'Revenue Overview', icon: TrendingUp },
];

export function AdminDashboardPage() {
  const { user, isHydrating } = useAdminAuth();
  const { data, isLoading, isError, error, refetch, isFetching } = useDashboardAnalytics();

  const handleRefresh = async () => {
    const result = await refetch();
    if (result.isSuccess) {
      toast.success('Dashboard refreshed.');
    }
  };

  if (isHydrating) {
    return <LoadingState message="Loading dashboard…" fullPage />;
  }

  return (
    <div className="admin-dashboard-page">
      <div className="admin-dashboard-page__glow" aria-hidden="true" />
      <div className="admin-dashboard-page__inner">
        <div className="admin-dashboard-page__header">
          <div>
            <h1>Dashboard</h1>
            <p>Platform overview and key metrics for Hoops Engine.</p>
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
        </div>

        <Card className="admin-dashboard-welcome-card">
          <div className="admin-dashboard-welcome-card__header">
            <h3>Welcome back{user ? `, ${getUserDisplayName(user)}` : ''}</h3>
            <p>
              {data?.description ??
                'Your Super Admin dashboard is ready. Use the navigation to manage platform resources.'}
            </p>
          </div>
        </Card>

        {isLoading ? (
          <div className="admin-dashboard-metrics" aria-busy="true" aria-label="Loading dashboard metrics">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="admin-dashboard-metric-card--skeleton">
                <Skeleton className="mb-3 h-4 w-24 bg-muted" />
                <Skeleton className="h-8 w-16 bg-muted" />
              </Card>
            ))}
          </div>
        ) : null}

        {isError ? (
          <EmptyState
            title="Unable to load dashboard metrics"
            description={getApiErrorMessage(error, 'Unable to load dashboard data. Please try again.')}
            action={
              <Button
                onClick={handleRefresh}
                isLoading={isFetching}
                disabled={isFetching}
                className="admin-primary-btn"
              >
                {isFetching ? 'Retrying…' : 'Retry'}
              </Button>
            }
          />
        ) : null}

        {!isLoading && !isError && data ? (
          <div className="admin-dashboard-metrics" aria-label="Dashboard metrics">
            {metricConfig.map(({ key, label, icon: Icon }) => (
              <Card key={key} className="admin-dashboard-metric-card">
                <div className="admin-dashboard-metric-card__header">
                  <span className="admin-dashboard-metric-card__label">{label}</span>
                  <Icon className="admin-dashboard-metric-card__icon h-4 w-4" aria-hidden="true" />
                </div>
                <div className="admin-dashboard-metric-card__value-wrap">
                  <p className="admin-dashboard-metric-card__value">
                    {key === 'revenue_overview'
                      ? new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD',
                          maximumFractionDigits: 0,
                        }).format(data[key])
                      : data[key].toLocaleString()}
                  </p>
                </div>
              </Card>
            ))}
          </div>
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
                className="admin-primary-btn"
              >
                {isFetching ? 'Refreshing…' : 'Refresh'}
              </Button>
            }
          />
        ) : null}

        <QuickAccessNav />

        <ModuleNavCards />
      </div>
    </div>
  );
}
