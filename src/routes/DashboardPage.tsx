import {
  Building2,
  CreditCard,
  DollarSign,
  ExternalLink,
  RefreshCw,
  TrendingUp,
  UserCheck,
  Users,
} from 'lucide-react';
import { toast } from 'sonner';
import { MetricCard } from '@/components/features/dashboard/MetricCard';
import { ErrorMessage } from '@/components/shared/ErrorMessage';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { useDashboard } from '@/hooks/useDashboard';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

export function DashboardPage() {
  const { data, isLoading, error, isNotFound, refetch } = useDashboard();

  const handleRefresh = async () => {
    const success = await refetch();
    if (success) {
      toast.success('Dashboard refreshed successfully.');
    }
  };

  const hasStatusPanel = Boolean(data?.description || data?.link || data?.error);

  if (error && !data) {
    return (
      <div className="space-y-6">
        <PageHeader title="Dashboard" description="Platform overview and key metrics." />
        <ErrorMessage message={error} />
        <Button type="button" onClick={() => void refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  if (!isLoading && isNotFound) {
    return (
      <div className="space-y-6">
        <PageHeader title="Dashboard" description="Platform overview and key metrics." />
        <EmptyState
          title="No Analytics Data Available"
          description="Analytics data is not available yet. Try refreshing once the backend is connected."
        />
        <Button type="button" variant="outline" onClick={() => void handleRefresh()}>
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Refresh
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <PageHeader title="Dashboard" description="Platform overview and key metrics." />
        <Button
          type="button"
          variant="outline"
          onClick={() => void handleRefresh()}
          disabled={isLoading}
          aria-busy={isLoading}
          aria-label="Refresh Dashboard"
        >
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Refresh
        </Button>
      </div>

      {hasStatusPanel ? (
        <div className="space-y-3 rounded-lg border bg-card p-4 text-sm">
          {data?.error ? <ErrorMessage message={data.error} /> : null}
          {data?.description ? (
            <p className="text-muted-foreground">{data.description}</p>
          ) : null}
          {data?.link ? (
            <a
              href={data.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-primary hover:underline"
            >
              View Details
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          ) : null}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          label="Total Organizations"
          value={data?.total_organizations ?? 0}
          icon={Building2}
          isLoading={isLoading}
        />
        <MetricCard
          label="Total Coaches"
          value={data?.total_coaches ?? 0}
          icon={UserCheck}
          isLoading={isLoading}
        />
        <MetricCard
          label="Total Players"
          value={data?.total_players ?? 0}
          icon={Users}
          isLoading={isLoading}
        />
        <MetricCard
          label="Total Sessions"
          value={data?.total_sessions ?? 0}
          icon={TrendingUp}
          isLoading={isLoading}
        />
        <MetricCard
          label="Active Subscriptions"
          value={data?.active_subscriptions ?? 0}
          icon={CreditCard}
          isLoading={isLoading}
        />
        <MetricCard
          label="Revenue Overview"
          value={isLoading ? '—' : currencyFormatter.format(data?.revenue_overview ?? 0)}
          icon={DollarSign}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
