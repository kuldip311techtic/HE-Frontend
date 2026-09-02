import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  Activity,
  Building2,
  CreditCard,
  DollarSign,
  HeadphonesIcon,
  LayoutDashboard,
  RefreshCw,
  UserCircle,
  Users,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ErrorMessage } from "@/components/ui/feedback";
import { useAuth } from "@/hooks/useAuth";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import { getApiErrorMessage } from "@/lib/api/client";
import {
  adminMetricCardClass,
  adminModuleNavLinkClass,
  adminOutlineButtonClass,
  adminSectionCardClass,
} from "@/lib/adminFormStyles";
import { cn } from "@/lib/utils";

interface ProfileTableRow {
  field: string;
  value: string;
}

interface MetricItem {
  label: string;
  value: string;
  icon: typeof Building2;
  description: string;
}

interface ModuleLink {
  label: string;
  href: string;
  description: string;
  icon: typeof Building2;
}

function MetricCard({ metric }: { metric: MetricItem }) {
  const Icon = metric.icon;

  return (
    <Card className={adminMetricCardClass}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-[16px] pb-[8px]">
        <CardTitle className="font-lato text-[14px] font-medium leading-[17.64px] text-figma-muted">
          {metric.label}
        </CardTitle>
        <Icon
          className="h-4 w-4 shrink-0 text-figma-bright"
          aria-hidden="true"
        />
      </CardHeader>
      <CardContent className="space-y-[4px] p-[16px] pt-0">
        <div
          className="truncate font-outfit text-[18px] font-bold leading-[22.68px] text-white"
          aria-label={`${metric.label}: ${metric.value}`}
        >
          {metric.value}
        </div>
        <p className="font-outfit text-[14px] font-normal leading-[17.64px] text-figma-muted">
          {metric.description}
        </p>
      </CardContent>
    </Card>
  );
}

export function AdminDashboardPage() {
  const { user } = useAuth();
  const {
    isSuperAdmin,
    profile,
    dashboard,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useAdminDashboard();

  const handleRefresh = async () => {
    const result = await refetch();
    if (result.isError) {
      toast.error(getApiErrorMessage(result.error));
      return;
    }
    toast.success("Dashboard refreshed");
  };

  const superAdminMetrics: MetricItem[] = [
    {
      label: "Total Organizations",
      value: dashboard?.total_organizations?.toLocaleString() ?? "0",
      icon: Building2,
      description: "Registered organizations",
    },
    {
      label: "Total Coaches",
      value: dashboard?.total_coaches?.toLocaleString() ?? "0",
      icon: Users,
      description: "Active coaches",
    },
    {
      label: "Total Players",
      value: dashboard?.total_players?.toLocaleString() ?? "0",
      icon: Activity,
      description: "Registered players",
    },
    {
      label: "Total Sessions",
      value: dashboard?.total_sessions?.toLocaleString() ?? "0",
      icon: LayoutDashboard,
      description: "Total sessions recorded",
    },
    {
      label: "Active Subscriptions",
      value: dashboard?.active_subscriptions?.toLocaleString() ?? "0",
      icon: CreditCard,
      description: "Currently active plans",
    },
    {
      label: "Revenue Overview",
      value: `$${(dashboard?.revenue_overview ?? 0).toLocaleString()}`,
      icon: DollarSign,
      description: "Platform revenue",
    },
  ];

  const orgAdminMetrics: MetricItem[] = [
    {
      label: "Organization",
      value: profile?.organization_name || profile?.name || "Active",
      icon: Building2,
      description: "Organization name",
    },
    {
      label: "Primary contact",
      value: profile
        ? `${profile.first_name} ${profile.last_name}`.trim() || "—"
        : "—",
      icon: Users,
      description: "Organization admin",
    },
    {
      label: "Contact info",
      value: profile?.contact_info || "—",
      icon: Activity,
      description: "Organization contact",
    },
    {
      label: "Description",
      value: profile?.description
        ? profile.description.length > 24
          ? `${profile.description.slice(0, 24)}…`
          : profile.description
        : "—",
      icon: LayoutDashboard,
      description: "Organization summary",
    },
  ];

  const metrics = isSuperAdmin ? superAdminMetrics : orgAdminMetrics;

  const profileColumns: DataTableColumn<ProfileTableRow>[] = [
    {
      id: "field",
      header: "Field",
      cell: (row) => (
        <span className="font-medium text-foreground">{row.field}</span>
      ),
    },
    {
      id: "value",
      header: "Value",
      cell: (row) => row.value,
    },
  ];

  const profileRows: ProfileTableRow[] = profile
    ? [
        {
          field: "Organization name",
          value: profile.organization_name || profile.name || "—",
        },
        {
          field: "Primary contact",
          value:
            `${profile.first_name} ${profile.last_name}`.trim() ||
            profile.name ||
            "—",
        },
        {
          field: "Contact info",
          value: profile.contact_info || "—",
        },
        {
          field: "Description",
          value: profile.description || "—",
        },
      ]
    : [];

  const pageTitle = isSuperAdmin ? "Super Admin Dashboard" : "Admin Dashboard";
  const pageDescription = isSuperAdmin
    ? "Monitor platform-wide organizations, coaches, and session activity."
    : `Welcome back, ${user?.firstName}. Manage your organization, teams, and coaches from the admin panel.`;

  const moduleLinks: ModuleLink[] = [
    {
      label: "Organizations",
      href: "/admin/organization",
      description: "Manage registered organizations",
      icon: Building2,
    },
    {
      label: "Coaches",
      href: "/admin/users",
      description: "Manage coach accounts",
      icon: UserCircle,
    },
    {
      label: "Players",
      href: "/admin/users",
      description: "Manage player accounts",
      icon: Users,
    },
    {
      label: "Subscriptions",
      href: "/admin/subscriptions",
      description: "Manage subscription plans",
      icon: CreditCard,
    },
    {
      label: "Support Requests",
      href: "/admin/support-requests",
      description: "Review user inquiries",
      icon: HeadphonesIcon,
    },
  ];

  return (
    <div className="w-full space-y-[16px] font-outfit">
      <PageHeader
        title={pageTitle}
        description={pageDescription}
        className="gap-[12px]"
        titleClassName="text-[18px] font-bold leading-[22.68px] tracking-[0.18px] text-white"
        descriptionClassName="text-[16px] font-normal leading-[22px] text-figma-muted"
        action={
          isSuperAdmin ? (
            <Button
              variant="outline"
              size="sm"
              className={adminOutlineButtonClass}
              onClick={() => void handleRefresh()}
              disabled={isLoading || isFetching}
              aria-busy={isFetching}
            >
              <RefreshCw
                className={cn("mr-2 h-4 w-4", isFetching && "animate-spin")}
                aria-hidden="true"
              />
              {isFetching ? "Refreshing…" : "Refresh"}
            </Button>
          ) : (
            <Button asChild size="sm">
              <Link to="/admin/teams">Create team</Link>
            </Button>
          )
        }
      />

      {error && (
        <ErrorMessage message={error} onRetry={() => void refetch()} />
      )}

      <div
        className={
          isSuperAdmin
            ? "grid gap-[16px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
            : "grid gap-[16px] sm:grid-cols-2 xl:grid-cols-4"
        }
        aria-busy={isLoading}
        aria-live="polite"
      >
        {isLoading
          ? Array.from({ length: isSuperAdmin ? 6 : 4 }).map((_, index) => (
              <Skeleton
                key={index}
                className="h-[112px] rounded-[10px] bg-figma-surface"
              />
            ))
          : metrics.map((metric) => (
              <MetricCard key={metric.label} metric={metric} />
            ))}
      </div>

      {isSuperAdmin && (
        <Card className={adminSectionCardClass}>
          <CardHeader className="p-[16px] pb-[12px]">
            <CardTitle className="font-outfit text-[16px] font-semibold leading-[20.16px] text-white">
              Module navigation
            </CardTitle>
            <p className="font-outfit text-[14px] font-normal leading-[17.64px] text-figma-muted">
              Jump to core Super Admin modules
            </p>
          </CardHeader>
          <CardContent className="p-[16px] pt-0">
            <nav
              aria-label="Super Admin modules"
              className="grid gap-[12px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
            >
              {moduleLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Button
                    key={`${link.href}-${link.label}`}
                    variant="outline"
                    className={adminModuleNavLinkClass}
                    asChild
                  >
                    <Link to={link.href}>
                      <span className="flex w-full items-center gap-[8px]">
                        <Icon
                          className="h-4 w-4 shrink-0 text-figma-bright"
                          aria-hidden="true"
                        />
                        <span className="text-[16px] font-medium leading-[20.16px] text-white">
                          {link.label}
                        </span>
                      </span>
                      <span className="text-[14px] font-normal leading-[17.64px] text-figma-muted">
                        {link.description}
                      </span>
                    </Link>
                  </Button>
                );
              })}
            </nav>
          </CardContent>
        </Card>
      )}

      {!isSuperAdmin && (
        <DataTable
          columns={profileColumns}
          data={profileRows}
          isLoading={isLoading}
          error={error}
          onRetry={() => void refetch()}
          searchPlaceholder="Search profile fields…"
          searchKeys={["field", "value"]}
          primaryAction={
            <Button asChild size="sm" variant="outline">
              <Link to="/admin/organization">Edit organization</Link>
            </Button>
          }
          emptyTitle="Organization profile unavailable"
          emptyDescription="We could not load your organization profile details."
        />
      )}

      <Card className={adminSectionCardClass}>
        <CardHeader className="p-[16px] pb-[12px]">
          <div className="flex items-center justify-between gap-[12px]">
            <CardTitle className="font-outfit text-[16px] font-semibold leading-[20.16px] text-white">
              Account overview
            </CardTitle>
            <Badge
              variant="secondary"
              className="rounded-[10px] border border-figma-border bg-[#1bc94f1a] capitalize text-figma-bright"
            >
              {user?.role.replace(/_/g, " ")}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-[12px] p-[16px] pt-0">
          <div className="flex items-center justify-between gap-[12px] text-sm">
            <span className="font-lato text-[14px] font-medium leading-[17.64px] text-figma-muted">
              Account email
            </span>
            <span className="font-outfit text-[14px] font-medium leading-[17.64px] text-white">
              {user?.email}
            </span>
          </div>
          <div className="flex items-center justify-between gap-[12px] text-sm">
            <span className="font-lato text-[14px] font-medium leading-[17.64px] text-figma-muted">
              Admin access
            </span>
            <Badge
              variant="default"
              className="rounded-[10px] bg-figma-brand text-[#0d1612] hover:bg-figma-brand/90"
            >
              Active
            </Badge>
          </div>
          <div className="flex items-center justify-between gap-[12px] text-sm">
            <span className="font-lato text-[14px] font-medium leading-[17.64px] text-figma-muted">
              API connection
            </span>
            <span className="font-outfit text-[14px] font-medium leading-[17.64px] text-figma-bright">
              Configured
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function AdminDashboardSkeleton() {
  return (
    <div className="w-full space-y-[16px] font-outfit">
      <PageHeader
        title="Admin Dashboard"
        description="Loading dashboard data…"
      />
      <div className="grid gap-[16px] sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton
            key={i}
            className="h-[112px] rounded-[10px] bg-figma-surface"
          />
        ))}
      </div>
      <Skeleton className="h-72 w-full rounded-[10px] bg-figma-surface" />
    </div>
  );
}
