import {
  Building2,
  CalendarDays,
  CreditCard,
  DollarSign,
  type LucideIcon,
  UserRound,
  Users,
} from 'lucide-react';
import EmptyState from '@/components/shared/EmptyState';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn, formatCurrency, formatNumber, isDashboardEmpty } from '@/lib/utils';
import type { DashboardMetrics } from '@/types/dashboard';

interface MetricDefinition {
  key: keyof Omit<DashboardMetrics, 'links'>;
  label: string;
  icon: LucideIcon;
  format: 'number' | 'currency';
}

const METRIC_DEFINITIONS: MetricDefinition[] = [
  {
    key: 'total_organizations',
    label: 'Total Organizations',
    icon: Building2,
    format: 'number',
  },
  {
    key: 'total_coaches',
    label: 'Total Coaches',
    icon: UserRound,
    format: 'number',
  },
  {
    key: 'total_players',
    label: 'Total Players',
    icon: Users,
    format: 'number',
  },
  {
    key: 'total_sessions',
    label: 'Total Sessions',
    icon: CalendarDays,
    format: 'number',
  },
  {
    key: 'active_subscriptions',
    label: 'Active Subscriptions',
    icon: CreditCard,
    format: 'number',
  },
  {
    key: 'revenue_overview',
    label: 'Revenue Overview',
    icon: DollarSign,
    format: 'currency',
  },
];

interface DashboardMetricsProps {
  metrics: DashboardMetrics | undefined;
  loading: boolean;
}

function MetricSkeleton() {
  return (
    <Card aria-hidden="true">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-9 w-9 rounded-lg" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-24" />
      </CardContent>
    </Card>
  );
}

function formatMetricValue(value: number, format: 'number' | 'currency'): string {
  if (format === 'currency') {
    return formatCurrency(value);
  }

  return formatNumber(value);
}

export default function DashboardMetrics({
  metrics,
  loading,
}: DashboardMetricsProps) {
  if (loading) {
    return (
      <section
        aria-label="Platform metrics"
        aria-busy="true"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
      >
        {METRIC_DEFINITIONS.map((metric) => (
          <MetricSkeleton key={metric.key} />
        ))}
      </section>
    );
  }

  if (!metrics) {
    return null;
  }

  if (isDashboardEmpty(metrics)) {
    return (
      <EmptyState
        title="No platform activity yet"
        description="Metrics will appear here once organizations, coaches, and players begin using the platform."
      />
    );
  }

  return (
    <section
      aria-label="Platform metrics"
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
    >
      {METRIC_DEFINITIONS.map((metric) => {
        const Icon = metric.icon;
        const value = metrics[metric.key];

        return (
          <Card key={metric.key} className="transition-shadow hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.label}
              </CardTitle>
              <div
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10',
                )}
                aria-hidden="true"
              >
                <Icon className="h-5 w-5 text-accent" />
              </div>
            </CardHeader>
            <CardContent>
              <p
                className="text-2xl font-bold tabular-nums text-foreground sm:text-3xl"
                aria-label={`${metric.label}: ${formatMetricValue(value, metric.format)}`}
              >
                {formatMetricValue(value, metric.format)}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </section>
  );
}
