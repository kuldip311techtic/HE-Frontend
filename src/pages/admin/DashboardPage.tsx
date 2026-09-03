import {
  Building2,
  CalendarDays,
  CreditCard,
  DollarSign,
  RefreshCw,
  Users,
  UserSquare2,
} from 'lucide-react';
import { toast } from 'sonner';

import { ModuleNavCards } from '@/components/features/dashboard/ModuleNavCards';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { LoadingState } from '@/components/ui/loading-state';
import { useSuperAdminDashboard } from '@/hooks/useSuperAdminDashboard';
import { getApiErrorMessage } from '@/lib/api/get-api-error-message';
import type { DashboardAnalyticsResponse } from '@/types/api';

const METRICS = [
  {
    key: 'total_organizations',
    label: 'Total Organizations',
    icon: Building2,
  },
  {
    key: 'total_coaches',
    label: 'Total Coaches',
    icon: UserSquare2,
  },
  {
    key: 'total_players',
    label: 'Total Players',
    icon: Users,
  },
  {
    key: 'total_sessions',
    label: 'Total Sessions',
    icon: CalendarDays,
  },
  {
    key: 'active_subscriptions',
    label: 'Active Subscriptions',
    icon: CreditCard,
  },
  {
    key: 'revenue_overview',
    label: 'Revenue Overview',
    icon: DollarSign,
  },
] as const satisfies ReadonlyArray<{
  key: keyof DashboardAnalyticsResponse;
  label: string;
  icon: typeof Building2;
}>;

function formatMetricValue(
  key: (typeof METRICS)[number]['key'],
  value: number | null | undefined,
): string {
  if (value == null) {
    return '—';
  }

  if (value === 0) {
    return '0';
  }

  if (key === 'revenue_overview') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  }

  return new Intl.NumberFormat('en-US').format(value);
}

export function DashboardPage() {
  const { data, isLoading, isError, error, refetch, isFetching } = useSuperAdminDashboard();

  const handleRefresh = async () => {
    try {
      await refetch();
      toast.success('Dashboard refreshed.');
    } catch {
      toast.error('Unable to refresh dashboard. Please try again.');
    }
  };

  if (isLoading) {
    return <LoadingState message="Loading dashboard analytics…" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-outfit text-body-25">Dashboard</h1>
          <p className="mt-1 text-body-sm text-muted-foreground">
            {data?.description ?? 'Platform performance overview for Super Admin decision-making.'}
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => void handleRefresh()}
          isLoading={isFetching}
          disabled={isFetching}
          aria-label="Refresh dashboard analytics"
        >
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Refresh
        </Button>
      </div>

      {isError ? (
        <EmptyState
          title="Unable to load analytics"
          description={getApiErrorMessage(error)}
          action={
            <Button type="button" variant="outline" onClick={() => void handleRefresh()}>
              Retry
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {METRICS.map((metric) => (
            <Card key={metric.key}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-body-sm font-medium text-muted-foreground">
                  {metric.label}
                </CardTitle>
                <metric.icon className="h-4 w-4 text-primary" aria-hidden="true" />
              </CardHeader>
              <CardContent>
                <p className="font-outfit text-body-33 tabular-nums">
                  {formatMetricValue(metric.key, data?.[metric.key] as number | null | undefined)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ModuleNavCards />
    </div>
  );
}
