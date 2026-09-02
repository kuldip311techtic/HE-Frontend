import { Link } from "react-router-dom";
import { BarChart3, Shield, Users } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
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

function MetricCard({
  label,
  value,
  isLoading,
}: {
  label: string;
  value: number | undefined;
  isLoading: boolean;
}) {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-[8px]">
        <CardTitle className="font-lato text-body-5 text-muted-foreground">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[28px] w-[72px]" />
        ) : (
          <p className="text-body-25 text-foreground">
            {value?.toLocaleString() ?? "—"}
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
    data: dashboard,
    isLoading,
    isError,
    error,
    refetch,
  } = useAdminDashboard(shouldFetchDashboard);

  const sessionId = shouldFetchDashboard
    ? (extractSessionId(dashboard?.link) ?? "1")
    : null;

  useSessionDetail(sessionId);

  const pageTitle = isSuperAdmin ? "Super Admin Dashboard" : "Admin Dashboard";
  const pageDescription = isSuperAdmin
    ? dashboard?.description ??
      "Platform analytics and management modules for Hoops Engine administrators."
    : `Welcome back, ${user?.firstName ?? "Admin"}. Manage your organization, teams, and coaches from this workspace.`;

  return (
    <div className="w-full space-y-[16px] font-outfit">
      <PageHeader title={pageTitle} description={pageDescription} />

      {shouldFetchDashboard && isError && (
        <ErrorMessage
          message={getApiErrorMessage(
            error,
            "Unable to load dashboard analytics. Please try again.",
          )}
          onRetry={() => void refetch()}
        />
      )}

      {isSuperAdmin && (
        <div className="grid w-full gap-[12px] sm:grid-cols-2 xl:grid-cols-3">
          <MetricCard
            label="Organizations"
            value={dashboard?.total_organizations}
            isLoading={isLoading}
          />
          <MetricCard
            label="Coaches"
            value={dashboard?.total_coaches}
            isLoading={isLoading}
          />
          <MetricCard
            label="Players"
            value={dashboard?.total_players}
            isLoading={isLoading}
          />
          <MetricCard
            label="Sessions"
            value={dashboard?.total_sessions}
            isLoading={isLoading}
          />
          <MetricCard
            label="Active subscriptions"
            value={dashboard?.active_subscriptions}
            isLoading={isLoading}
          />
          <MetricCard
            label="Revenue overview"
            value={dashboard?.revenue_overview}
            isLoading={isLoading}
          />
        </div>
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
              ? "You have platform-wide access. Review analytics above and use the sidebar to manage organizations, users, and platform settings."
              : "You can manage your organization profile, teams, and coaches from the navigation. Changes you make here apply across your organization."}
          </p>
          <div className="flex flex-wrap items-center gap-[10px]">
            <Badge variant="secondary" className="text-body-sm capitalize">
              {user?.role.replace(/_/g, " ")}
            </Badge>
            <Badge variant="outline" className="text-body-sm">
              Admin access active
            </Badge>
            {isSuperAdmin && sessionId && (
              <Link
                to={`/admin/sessions/${sessionId}`}
                className="text-body-sm font-medium text-primary underline-offset-4 hover:underline"
              >
                View session detail
              </Link>
            )}
          </div>
        </CardContent>
      </Card>

      {isSuperAdmin && !isLoading && dashboard && (
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center gap-[12px] space-y-0">
            <BarChart3 className="h-5 w-5 text-primary" aria-hidden="true" />
            <CardTitle className="text-body-25 text-foreground">
              Platform snapshot
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-[12px] sm:grid-cols-2">
            <div className="flex items-center gap-[10px] rounded-[10px] border border-border bg-background/40 px-[14px] py-[12px]">
              <Users className="h-5 w-5 text-primary" aria-hidden="true" />
              <div>
                <p className="font-lato text-body-5 text-muted-foreground">
                  Total coaches
                </p>
                <p className="text-body-13 text-foreground">
                  {dashboard.total_coaches.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-[10px] rounded-[10px] border border-border bg-background/40 px-[14px] py-[12px]">
              <Users className="h-5 w-5 text-primary" aria-hidden="true" />
              <div>
                <p className="font-lato text-body-5 text-muted-foreground">
                  Total players
                </p>
                <p className="text-body-13 text-foreground">
                  {dashboard.total_players.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-body-25 text-foreground">
            Account overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-[12px]">
          <div className="flex items-center justify-between">
            <span className="font-lato text-body-5 text-muted-foreground">
              Account email
            </span>
            <span className="text-body-13 text-foreground">{user?.email}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-lato text-body-5 text-muted-foreground">
              Admin access
            </span>
            <Badge className="text-body-sm">Active</Badge>
          </div>
          <div className="flex items-center justify-between">
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
