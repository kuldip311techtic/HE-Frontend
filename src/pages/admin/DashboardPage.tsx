import { Link } from "react-router-dom";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/PageHeader";
import { ModuleNavCards } from "@/components/features/super-admin/ModuleNavCards";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorMessage } from "@/components/ui/feedback";
import { useAuth } from "@/hooks/useAuth";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import { useHasLiveApiAccess } from "@/hooks/useHasLiveApiAccess";
import { getApiErrorMessage } from "@/lib/api/client";
import type { SuperAdminDashboard } from "@/types/api";
import { cn } from "@/lib/utils";

const DEMO_DASHBOARD: SuperAdminDashboard = {
  total_organizations: 24,
  total_coaches: 156,
  total_players: 892,
  total_sessions: 1240,
  active_subscriptions: 18,
  revenue_overview: 48500,
  description: null,
  link: null,
  error: null,
};

interface MetricDefinition {
  label: string;
  value: number | undefined;
  href?: string;
  format?: "number" | "currency";
}

interface MetricCardProps {
  metric: MetricDefinition;
  isLoading: boolean;
}

function formatMetricValue(
  value: number | undefined,
  format: MetricDefinition["format"] = "number",
): string {
  const safeValue = value ?? 0;
  if (format === "currency") {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(safeValue);
  }
  return safeValue.toLocaleString();
}

function MetricCard({ metric, isLoading }: MetricCardProps) {
  const content = (
    <>
      <CardHeader className="pb-[8px]">
        <CardTitle className="font-lato text-body-5 text-muted-foreground">
          {metric.label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[28px] w-[72px]" aria-hidden="true" />
        ) : (
          <p className="text-body-25 tabular-nums text-foreground">
            {formatMetricValue(metric.value, metric.format)}
          </p>
        )}
      </CardContent>
    </>
  );

  if (metric.href && !isLoading) {
    return (
      <Link
        to={metric.href}
        className={cn(
          "block rounded-[10px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        )}
        aria-label={`View ${metric.label.toLowerCase()}`}
      >
        <Card className="h-full border-border bg-card transition-colors hover:border-primary/40 hover:bg-card/80">
          {content}
        </Card>
      </Link>
    );
  }

  return (
    <Card className="border-border bg-card">
      {content}
    </Card>
  );
}

export function AdminDashboardPage() {
  const { user } = useAuth();
  const hasLiveApiAccess = useHasLiveApiAccess();
  const isSuperAdmin =
    user?.role === "super_admin" || user?.roles.includes("super_admin");
  const shouldFetchDashboard = isSuperAdmin && hasLiveApiAccess;

  const {
    data: liveDashboard,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useAdminDashboard(shouldFetchDashboard);

  const dashboard = shouldFetchDashboard
    ? liveDashboard
    : isSuperAdmin
      ? DEMO_DASHBOARD
      : undefined;

  const pageTitle = isSuperAdmin ? "Super Admin Dashboard" : "Admin Dashboard";
  const pageDescription = isSuperAdmin
    ? dashboard?.description ??
      "Platform analytics and management overview for Hoops Engine administrators."
    : `Welcome back, ${user?.firstName ?? "Admin"}. Your admin workspace is ready.`;

  const handleRefresh = async () => {
    if (!shouldFetchDashboard) {
      toast.success("Dashboard data refreshed successfully.");
      return;
    }

    const result = await refetch();
    if (result.isError) {
      toast.error(
        getApiErrorMessage(
          result.error,
          "Unable to refresh dashboard data. Please try again.",
        ),
      );
      return;
    }
    toast.success("Dashboard data refreshed successfully.");
  };

  const metricsLoading = shouldFetchDashboard
    ? isLoading || isFetching
    : false;

  const metrics: MetricDefinition[] = [
    {
      label: "Total organizations",
      value: dashboard?.total_organizations,
      href: "/admin/organizations",
    },
    {
      label: "Total coaches",
      value: dashboard?.total_coaches,
      href: "/admin/users?role=coach",
    },
    {
      label: "Total players",
      value: dashboard?.total_players,
      href: "/admin/users?role=player",
    },
    {
      label: "Total sessions",
      value: dashboard?.total_sessions,
    },
    {
      label: "Active subscriptions",
      value: dashboard?.active_subscriptions,
      href: "/admin/subscriptions",
    },
    {
      label: "Revenue overview",
      value: dashboard?.revenue_overview,
      format: "currency",
    },
  ];

  if (!isSuperAdmin) {
    return (
      <div className="w-full space-y-[16px] font-outfit">
        <PageHeader title={pageTitle} description={pageDescription} />
        <Card className="border-border bg-card">
          <CardContent className="py-[24px]">
            <p className="text-body-21 text-foreground">
              Welcome back, {user?.firstName ?? "Admin"}. Your admin workspace is
              ready.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full space-y-[16px] font-outfit">
      <PageHeader
        title={pageTitle}
        description={pageDescription}
        action={
          <Button
            variant="outline"
            size="sm"
            className="min-h-11 sm:min-h-9"
            onClick={() => void handleRefresh()}
            isLoading={shouldFetchDashboard && isFetching && !isLoading}
            disabled={shouldFetchDashboard && isFetching}
            aria-label="Refresh dashboard metrics"
          >
            <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
            Refresh
          </Button>
        }
      />

      {shouldFetchDashboard && isError && (
        <ErrorMessage
          message={getApiErrorMessage(
            error,
            "Unable to load dashboard analytics. Please try again.",
          )}
          onRetry={() => void handleRefresh()}
        />
      )}

      <section aria-labelledby="dashboard-metrics-heading">
        <h2 id="dashboard-metrics-heading" className="sr-only">
          Platform metrics
        </h2>
        <div className="grid w-full gap-[12px] sm:grid-cols-2 xl:grid-cols-3">
          {metrics.map((metric) => (
            <MetricCard
              key={metric.label}
              metric={metric}
              isLoading={metricsLoading}
            />
          ))}
        </div>
      </section>

      <ModuleNavCards />
    </div>
  );
}
