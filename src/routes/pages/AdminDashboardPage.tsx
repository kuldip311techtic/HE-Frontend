import {
  Building2,
  CreditCard,
  LifeBuoy,
  TrendingUp,
  Users,
  Activity,
} from 'lucide-react';
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
  { key: 'total_organizations' as const, label: 'Organizations', icon: Building2 },
  { key: 'total_coaches' as const, label: 'Coaches', icon: Users },
  { key: 'total_players' as const, label: 'Players', icon: Activity },
  { key: 'total_sessions' as const, label: 'Sessions', icon: TrendingUp },
  { key: 'active_subscriptions' as const, label: 'Active Subscriptions', icon: CreditCard },
  { key: 'revenue_overview' as const, label: 'Revenue Overview', icon: TrendingUp },
];

const moduleCards = [
  { title: 'Organizations', description: 'Manage organization accounts and settings.', icon: Building2 },
  { title: 'Users', description: 'View and manage platform users.', icon: Users },
  { title: 'Subscriptions', description: 'Monitor subscription plans and billing.', icon: CreditCard },
  { title: 'Support', description: 'Review and respond to support requests.', icon: LifeBuoy },
];

export function AdminDashboardPage() {
  const { user, isHydrating } = useAdminAuth();
  const { data, isLoading, isError, error, refetch, isFetching } = useDashboardAnalytics();

  if (isHydrating) {
    return <LoadingState message="Loading dashboard…" fullPage />;
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-body-42 text-foreground">Dashboard</h2>
        <p className="mt-1 font-outfit text-body-sm text-muted-foreground">
          Platform overview and key metrics for Hoops Engine.
        </p>
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
            <Button onClick={() => refetch()} isLoading={isFetching} disabled={isFetching}>
              {isFetching ? 'Retrying…' : 'Retry'}
            </Button>
          }
        />
      ) : null}

      {!isLoading && !isError && data ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
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
        />
      ) : null}

      <div>
        <h3 className="mb-4 font-outfit text-lg font-semibold text-foreground">Platform modules</h3>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {moduleCards.map(({ title, description, icon: Icon }) => (
            <Card key={title} className="opacity-80">
              <CardHeader>
                <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </div>
                <CardTitle className="text-base">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
              <CardContent>
                <span
                  aria-disabled="true"
                  className="font-outfit text-body-sm text-muted-foreground"
                >
                  Coming in a future release
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
