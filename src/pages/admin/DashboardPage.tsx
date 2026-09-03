import {
  Building2,
  CalendarDays,
  CreditCard,
  DollarSign,
  Users,
  UserSquare2,
} from 'lucide-react';

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
  const { data, isLoading, isError, error } = useSuperAdminDashboard();

  if (isLoading) {
    return <LoadingState message="Loading dashboard analytics…" />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-outfit text-body-25">Dashboard</h1>
        <p className="mt-1 text-body-sm text-muted-foreground">
          {data?.description ??
            'Super Admin analytics from GET /api/v1/super-admin/dashboard.'}
        </p>
      </div>

      {isError ? (
        <EmptyState
          title="Unable to load analytics"
          description={getApiErrorMessage(error)}
        />
      ) : null}

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
    </div>
  );
}
