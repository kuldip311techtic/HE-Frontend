import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Building2,
  CreditCard,
  DollarSign,
  GraduationCap,
  Loader2,
  Timer,
  Users,
} from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { ErrorMessage } from '@/components/shared/ErrorMessage';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useDashboard } from '@/hooks/useDashboard';
import { usePlayerRoleSelection } from '@/hooks/usePlayerRoleSelection';
import { getApiErrorMessage } from '@/lib/api';
import { formatNumber, formatWholeDollars } from '@/lib/format';

const METRICS = [
  {
    key: 'total_organizations' as const,
    label: 'Total Organizations',
    icon: Building2,
  },
  {
    key: 'total_coaches' as const,
    label: 'Total Coaches',
    icon: GraduationCap,
  },
  {
    key: 'total_players' as const,
    label: 'Total Players',
    icon: Users,
  },
  {
    key: 'total_sessions' as const,
    label: 'Total Sessions',
    icon: Timer,
  },
  {
    key: 'active_subscriptions' as const,
    label: 'Active Subscriptions',
    icon: CreditCard,
  },
  {
    key: 'revenue_overview' as const,
    label: 'Revenue Overview',
    icon: DollarSign,
  },
];

const MODULE_LINKS = [
  { label: 'Organizations', to: '/admin/organizations' },
  { label: 'Coaches', to: '/admin/users' },
  { label: 'Players', to: '/admin/users' },
  { label: 'Subscriptions', to: '/admin/subscriptions' },
];

export function DashboardPage() {
  const { data, isLoading, isRefreshing, error, reload, refresh } = useDashboard();
  usePlayerRoleSelection();

  const allZero =
    data &&
    data.total_organizations === 0 &&
    data.total_coaches === 0 &&
    data.total_players === 0 &&
    data.total_sessions === 0 &&
    data.active_subscriptions === 0 &&
    data.revenue_overview === 0;

  const handleRefresh = async () => {
    try {
      await refresh();
      toast.success('Dashboard Updated Successfully.');
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Unable to refresh dashboard. Please try again.'));
    }
  };

  const handleRetry = async () => {
    try {
      await reload('initial');
    } catch {
      /* error is shown inline */
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <PageHeader title="Dashboard" description="Platform performance overview." />
        <Button
          type="button"
          variant="outline"
          className="shrink-0"
          onClick={() => void handleRefresh()}
          disabled={isLoading || isRefreshing}
          aria-busy={isRefreshing}
          aria-label="Refresh Dashboard"
        >
          {isRefreshing ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
          {isRefreshing ? 'Refreshing…' : 'Refresh'}
        </Button>
      </div>

      <nav aria-label="Core Modules" className="flex flex-wrap gap-2">
        {MODULE_LINKS.map((item) => (
          <Button key={item.label} asChild variant="outline">
            <Link to={item.to}>{item.label}</Link>
          </Button>
        ))}
      </nav>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {METRICS.map((metric) => (
            <Skeleton key={metric.key} className="h-24 rounded-lg" />
          ))}
        </div>
      ) : null}

      {!isLoading && error && !data ? (
        <div className="space-y-3">
          <ErrorMessage message={error} />
          <Button type="button" variant="outline" onClick={() => void handleRetry()}>
            Retry
          </Button>
        </div>
      ) : null}

      {!isLoading && data ? (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {METRICS.map((metric) => {
              const Icon = metric.icon;
              const raw = data[metric.key];
              const value =
                metric.key === 'revenue_overview' ? formatWholeDollars(raw) : formatNumber(raw);
              return (
                <Card key={metric.key}>
                  <CardContent className="flex items-start justify-between gap-3 p-5">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">{metric.label}</p>
                      <p className="text-2xl font-semibold">{value}</p>
                    </div>
                    <Icon className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                  </CardContent>
                </Card>
              );
            })}
          </div>
          {allZero ? <p className="text-sm text-muted-foreground">No platform activity yet.</p> : null}
        </>
      ) : null}
    </div>
  );
}
