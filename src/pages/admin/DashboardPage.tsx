import { Link } from "react-router-dom";
import { RefreshCw, Shield } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/PageHeader";
import { ModuleNavCards } from "@/components/features/super-admin/ModuleNavCards";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorMessage } from "@/components/ui/feedback";
import { useAuth } from "@/hooks/useAuth";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import { useHasLiveApiAccess } from "@/hooks/useHasLiveApiAccess";
import { useSessionDetail } from "@/hooks/useSessionDetail";
import { getApiErrorMessage } from "@/lib/api/client";
import { extractSessionId } from "@/lib/api/session-utils";
import {
  isValidationAuthToken,
  VALIDATION_SESSION_ID,
} from "@/lib/auth/storage";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: number | undefined;
  isLoading: boolean;
  href?: string;
}

function MetricCard({ label, value, isLoading, href }: MetricCardProps) {
  const content = (
    <Card
      className={cn(
        "border-border bg-card",
        href &&
          "transition-colors hover:border-primary/50 hover:bg-accent/20 focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 focus-within:ring-offset-background",
      )}
    >
      <CardHeader className="pb-[8px]">
        <CardTitle className="font-lato text-body-5 text-muted-foreground">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[28px] w-[72px]" aria-hidden="true" />
        ) : (
          <p className="text-body-25 text-foreground">
            {(value ?? 0).toLocaleString()}
          </p>
        )}
      </CardContent>
    </Card>
  );

  if (href && !isLoading) {
    return (
      <Link to={href} className="block rounded-lg focus-visible:outline-none">
        {content}
      </Link>
    );
  }

  return content;
}

export function AdminDashboardPage() {
  const { user } = useAuth();
  const hasLiveApiAccess = useHasLiveApiAccess();
  const isSuperAdmin =
    user?.role === "super_admin" || user?.roles.includes("super_admin");
  const shouldFetchDashboard = isSuperAdmin && hasLiveApiAccess;

  const {
    data: dashboard,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useAdminDashboard(shouldFetchDashboard);

  const sessionId = dashboard?.link
    ? extractSessionId(dashboard.link)
    : null;

  const sessionDetailId = sessionId ?? (isValidationAuthToken() ? VALIDATION_SESSION_ID : null);
  useSessionDetail(shouldFetchDashboard ? sessionDetailId : null);

  const pageTitle = isSuperAdmin ? "Super Admin Dashboard" : "Admin Dashboard";
  const pageDescription = isSuperAdmin
    ? dashboard?.description ??
      "Platform analytics and management modules for Hoops Engine administrators."
    : `Welcome back, ${user?.firstName ?? "Admin"}. Manage your organization, teams, and coaches from this workspace.`;

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
            <MetricCard
              label="Total organizations"
              value={dashboard?.total_organizations}
              isLoading={metricsLoading}
              href="/admin/organizations"
            />
            <MetricCard
              label="Total coaches"
              value={dashboard?.total_coaches}
              isLoading={metricsLoading}
              href="/admin/users?role=coach"
            />
            <MetricCard
              label="Total players"
              value={dashboard?.total_players}
              isLoading={metricsLoading}
              href="/admin/users?role=player"
            />
            <MetricCard
              label="Total sessions"
              value={dashboard?.total_sessions}
              isLoading={metricsLoading}
            />
            <MetricCard
              label="Active subscriptions"
              value={dashboard?.active_subscriptions}
              isLoading={metricsLoading}
              href="/admin/subscriptions"
            />
            <MetricCard
              label="Revenue overview"
              value={dashboard?.revenue_overview}
              isLoading={metricsLoading}
            />
          </div>
        </section>
      )}

      {isSuperAdmin && (
        <section aria-labelledby="dashboard-modules-heading" className="space-y-[12px]">
          <h2
            id="dashboard-modules-heading"
            className="text-body-25 text-foreground"
          >
            Core modules
          </h2>
          <ModuleNavCards />
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
              Your admin workspace is ready. Use the sidebar to manage your
              organization and settings.
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-[12px]">
          <p className="text-body-21 text-foreground">
            {isSuperAdmin
              ? "You have platform-wide access. Review analytics above and use the module cards or sidebar to manage organizations, users, and platform settings."
              : "You can manage your organization profile, teams, and coaches from the navigation. Changes you make here apply across your organization."}
          </p>
          <div className="flex flex-wrap items-center gap-[10px]">
            <Badge variant="secondary" className="text-body-sm capitalize">
              {user?.role.replace(/_/g, " ")}
            </Badge>
            <Badge variant="outline" className="text-body-sm">
              Admin access active
            </Badge>
            {isSuperAdmin && (sessionId || isValidationAuthToken()) && (
              <Link
                to={`/admin/sessions/${sessionId ?? VALIDATION_SESSION_ID}`}
                className="text-body-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                View session detail
              </Link>
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
