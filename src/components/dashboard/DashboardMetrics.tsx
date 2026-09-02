import {
  Building2,
  CalendarDays,
  CreditCard,
  DollarSign,
  GraduationCap,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DASHBOARD_METRICS,
  formatMetricValue,
} from "@/lib/dashboard-helpers";
import type { DashboardMetricsData } from "@/types/dashboard";

const METRIC_ICONS: Record<
  (typeof DASHBOARD_METRICS)[number]["key"],
  LucideIcon
> = {
  total_organizations: Building2,
  total_coaches: GraduationCap,
  total_players: Users,
  total_sessions: CalendarDays,
  active_subscriptions: CreditCard,
  revenue_overview: DollarSign,
};

interface DashboardMetricsProps {
  metrics?: DashboardMetricsData;
  isLoading?: boolean;
}

function MetricCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-4 rounded-full" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-20" />
        <Skeleton className="mt-2 h-3 w-40" />
      </CardContent>
    </Card>
  );
}

export function DashboardMetrics({ metrics, isLoading }: DashboardMetricsProps) {
  if (isLoading) {
    return (
      <section aria-label="Dashboard metrics loading" className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight">Key Metrics</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {DASHBOARD_METRICS.map(({ key }) => (
            <MetricCardSkeleton key={key} />
          ))}
        </div>
      </section>
    );
  }

  if (!metrics) {
    return null;
  }

  return (
    <section aria-label="Dashboard metrics" className="space-y-4">
      <h2 className="text-lg font-semibold tracking-tight">Key Metrics</h2>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {DASHBOARD_METRICS.map(({ key, label, description, format }) => {
          const Icon = METRIC_ICONS[key];
          const value = metrics[key];

          return (
            <Card key={key} className="transition-shadow hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{label}</CardTitle>
                <Icon
                  className="h-4 w-4 text-muted-foreground"
                  aria-hidden="true"
                />
              </CardHeader>
              <CardContent>
                <p
                  className="text-2xl font-bold tabular-nums"
                  aria-label={`${label}: ${formatMetricValue(value, format)}`}
                >
                  {formatMetricValue(value, format)}
                </p>
                <CardDescription className="mt-1">{description}</CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
