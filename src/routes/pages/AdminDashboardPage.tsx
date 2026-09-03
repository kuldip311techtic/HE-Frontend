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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { LoadingState } from '@/components/ui/loading-state';
import { Skeleton } from '@/components/ui/skeleton';
import { useDashboardAnalytics } from '@/hooks/useDashboardAnalytics';
import { useAdminAuth } from '@/lib/auth/AdminAuthProvider';
import { getUserDisplayName } from '@/lib/auth/roles';
import { getApiErrorMessage } from '@/lib/utils/errors';

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
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-body-42 text-foreground">Dashboard</h2>
          <p className="mt-1 font-outfit text-body-sm text-muted-foreground">
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
          className="shrink-0"
        >
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          {isFetching ? 'Refreshing…' : 'Refresh'}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Welcome back{user ? `, ${getUserDisplayName(user)}` : ''}</CardTitle>
          <CardDescription>
            {data?.description ??
              'Your Super Admin dashboard is ready. Use the navigation to manage platform resources.'}
          </CardDescription>
        </CardHeader>
      </Card>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index}>
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
          description={getApiErrorMessage(error, 'Unable to load dashboard data. Please try again.')}
          action={
            <Button onClick={handleRefresh} isLoading={isFetching} disabled={isFetching}>
              {isFetching ? 'Retrying…' : 'Retry'}
            </Button>
          }
        />
      ) : null}

      {!isLoading && !isError && data ? (
        <div
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
          aria-label="Dashboard metrics"
        >
          {metricConfig.map(({ key, label, icon: Icon }) => (
            <Card key={key}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="font-outfit text-body-sm font-medium text-muted-foreground">
                  {label}
                </CardTitle>
                <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
              </CardHeader>
              <CardContent>
                <p className="font-outfit text-2xl font-bold text-foreground">
                  {key === 'revenue_overview'
                    ? new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        maximumFractionDigits: 0,
                      }).format(data[key])
                    : data[key].toLocaleString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}

      {!isLoading && !isError && !data ? (
        <EmptyState
          title="Dashboard ready"
          description="Metrics will appear here once analytics data is available."
          action={
            <Button onClick={handleRefresh} isLoading={isFetching} disabled={isFetching}>
              {isFetching ? 'Refreshing…' : 'Refresh'}
            </Button>
          }
        />
      ) : null}

      <QuickAccessNav />

      <ModuleNavCards />
    </div>
  );
}
