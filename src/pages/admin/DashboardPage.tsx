import { RefreshCw, Shield } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

interface MetricCardProps {
  label: string;
  value: number | undefined;
  isLoading: boolean;
}

function MetricCard({ label, value, isLoading }: MetricCardProps) {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-[8px]">
        <CardTitle className="font-lato text-body-5 text-muted-foreground">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[28px] w-[72px]" aria-hidden="true" />
        ) : (
          <p className="text-body-25 tabular-nums text-foreground">
            {(value ?? 0).toLocaleString()}
          </p>
        )}
      </CardContent>
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

  const metrics = [
    { label: "Total organizations", value: dashboard?.total_organizations },
    { label: "Total coaches", value: dashboard?.total_coaches },
    { label: "Total players", value: dashboard?.total_players },
    { label: "Total sessions", value: dashboard?.total_sessions },
    { label: "Active subscriptions", value: dashboard?.active_subscriptions },
    { label: "Revenue overview", value: dashboard?.revenue_overview },
  ];

  return (
    <div className="w-full space-y-[16px] font-outfit">
      <PageHeader
        title={pageTitle}
        description={pageDescription}
        action={
          isSuperAdmin && shouldFetchDashboard ? (
            <Button
              variant="outline"
              size="sm"
              className="min-h-9"
              onClick={() => void handleRefresh()}
              isLoading={isFetching && !isLoading}
              disabled={isFetching}
              aria-label="Refresh dashboard metrics"
            >
              <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
              Refresh
            </Button>
          ) : undefined
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

      {isSuperAdmin && (
        <section aria-labelledby="dashboard-metrics-heading">
          <h2 id="dashboard-metrics-heading" className="sr-only">
            Platform metrics
          </h2>
          <div className="grid w-full gap-[12px] sm:grid-cols-2 xl:grid-cols-3">
            {metrics.map((metric) => (
              <MetricCard
                key={metric.label}
                label={metric.label}
                value={metric.value}
                isLoading={metricsLoading}
              />
            ))}
          </div>
        </section>
      )}

      <Card className="border-border bg-card">
        <CardHeader className="flex flex-row items-center gap-[12px] space-y-0 pb-[12px]">
          <div className="flex h-12 w-12 items-center justify-center rounded-[10px] bg-primary/15">
            <Shield className="h-6 w-6 text-primary" aria-hidden="true" />
          </div>
          <div>
            <CardTitle className="text-body-25 text-foreground">
              Welcome to Hoops Engine Admin
            </CardTitle>
            <p className="text-body-sm text-muted-foreground">
              Your admin workspace is ready. Feature modules will appear in the
              sidebar as they are enabled.
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-[12px]">
          <p className="text-body-21 text-foreground">
            {isSuperAdmin
              ? "You have platform-wide access. Review analytics above while additional management modules are being rolled out."
              : "You can manage your organization from this workspace. Additional modules will be available in upcoming releases."}
          </p>
          <div className="flex flex-wrap items-center gap-[10px]">
            <Badge variant="secondary" className="text-body-sm capitalize">
              {user?.role.replace(/_/g, " ")}
            </Badge>
            <Badge variant="outline" className="text-body-sm">
              Admin access active
            </Badge>
            {!hasLiveApiAccess && isSuperAdmin && (
              <Badge
                variant="outline"
                className={cn("text-body-sm", "border-figma-brand/40 text-figma-brand")}
              >
                Demo mode
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-body-25 text-foreground">
            Account overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-[12px]">
          <div className="flex items-center justify-between gap-[12px]">
            <span className="font-lato text-body-5 text-muted-foreground">
              Account email
            </span>
            <span className="text-body-13 text-foreground">{user?.email}</span>
          </div>
          <div className="flex items-center justify-between gap-[12px]">
            <span className="font-lato text-body-5 text-muted-foreground">
              Admin access
            </span>
            <Badge className="text-body-sm">Active</Badge>
          </div>
          <div className="flex items-center justify-between gap-[12px]">
            <span className="font-lato text-body-5 text-muted-foreground">
              Signed in as
            </span>
            <span className="text-body-13 text-foreground">
              {user?.firstName} {user?.lastName}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
