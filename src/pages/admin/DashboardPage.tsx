import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  Building2,
  LayoutDashboard,
  Plus,
  Users,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import type { Organization } from "@/types/api";

interface ProfileTableRow {
  field: string;
  value: string;
}

export function AdminDashboardPage() {
  const { user } = useAuth();
  const {
    isSuperAdmin,
    profile,
    dashboard,
    organizations,
    isLoading,
    error,
    refetch,
  } = useAdminDashboard();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const metrics = isSuperAdmin
    ? [
        {
          label: "Organizations",
          value: dashboard?.total_organizations?.toLocaleString() ?? "0",
          icon: Building2,
          description: "Registered organizations",
        },
        {
          label: "Coaches",
          value: dashboard?.total_coaches?.toLocaleString() ?? "0",
          icon: Users,
          description: "Active coaches",
        },
        {
          label: "Players",
          value: dashboard?.total_players?.toLocaleString() ?? "0",
          icon: Activity,
          description: "Registered players",
        },
        {
          label: "Sessions",
          value: dashboard?.total_sessions?.toLocaleString() ?? "0",
          icon: LayoutDashboard,
          description: "Total sessions recorded",
        },
      ]
    : [
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

  const organizationColumns: DataTableColumn<Organization>[] = [
    {
      id: "name",
      header: "Organization",
      cell: (row) => (
        <span className="font-medium text-foreground">{row.name}</span>
      ),
    },
    {
      id: "email",
      header: "Contact email",
      cell: (row) => row.contact_email,
    },
    {
      id: "phone",
      header: "Phone",
      cell: (row) => row.phone_number || "—",
    },
    {
      id: "join_code",
      header: "Join code",
      cell: (row) => (
        <Badge variant="secondary" className="font-mono text-xs">
          {row.join_code}
        </Badge>
      ),
    },
  ];

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

  return (
    <div className="w-full space-y-5">
      <PageHeader
        title={pageTitle}
        description={pageDescription}
        action={
          <Button asChild size="sm">
            <Link to={isSuperAdmin ? "/admin/organization" : "/admin/teams"}>
              <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
              {isSuperAdmin ? "Manage organizations" : "Create team"}
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-28 rounded-lg" />
            ))
          : metrics.map((metric) => (
              <Card key={metric.label}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {metric.label}
                  </CardTitle>
                  <metric.icon
                    className="h-4 w-4 text-primary"
                    aria-hidden="true"
                  />
                </CardHeader>
                <CardContent>
                  <div className="truncate text-2xl font-bold text-foreground">
                    {metric.value}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {metric.description}
                  </p>
                </CardContent>
              </Card>
            ))}
      </div>

      {isSuperAdmin ? (
        <DataTable
          columns={organizationColumns}
          data={organizations}
          isLoading={isLoading}
          error={error}
          onRetry={refetch}
          searchPlaceholder="Search organizations…"
          searchKeys={["name", "contact_email", "join_code"]}
          primaryAction={
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
              Add organization
            </Button>
          }
          emptyTitle="No organizations yet"
          emptyDescription="Organizations will appear here once they are registered on the platform."
          pagination={{ page, pageSize, total: organizations.length }}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1);
          }}
        />
      ) : (
        <DataTable
          columns={profileColumns}
          data={profileRows}
          isLoading={isLoading}
          error={error}
          onRetry={refetch}
          searchPlaceholder="Search profile fields…"
          searchKeys={["field", "value"]}
          primaryAction={
            <Button asChild size="sm" variant="outline">
              <Link to="/admin/organization">Edit organization</Link>
            </Button>
          }
          emptyTitle="Organization profile unavailable"
          emptyDescription="We could not load your organization profile details."
          pagination={{ page, pageSize, total: profileRows.length }}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1);
          }}
        />
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Account overview</CardTitle>
            <Badge variant="secondary" className="capitalize">
              {user?.role.replace(/_/g, " ")}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Account email</span>
            <span className="font-medium">{user?.email}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Admin access</span>
            <Badge variant="default">Active</Badge>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">API connection</span>
            <span className="text-primary">Configured</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function AdminDashboardSkeleton() {
  return (
    <div className="w-full space-y-5">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-lg" />
        ))}
      </div>
      <Skeleton className="h-72 w-full rounded-lg" />
    </div>
  );
}
