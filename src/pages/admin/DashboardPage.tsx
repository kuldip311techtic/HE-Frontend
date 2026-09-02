import { Shield } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";

export function AdminDashboardPage() {
  const { user } = useAuth();
  const isSuperAdmin =
    user?.role === "super_admin" || user?.roles.includes("super_admin");

  const pageTitle = isSuperAdmin ? "Super Admin Dashboard" : "Admin Dashboard";
  const pageDescription = isSuperAdmin
    ? "Welcome to the Hoops Engine admin panel. Platform analytics and management modules will appear here."
    : `Welcome back, ${user?.firstName ?? "Admin"}. Manage your organization, teams, and coaches from this workspace.`;

  return (
    <div className="w-full space-y-[16px]">
      <PageHeader title={pageTitle} description={pageDescription} />

      <Card className="border-border bg-card">
        <CardHeader className="flex flex-row items-center gap-[12px] space-y-0 pb-[12px]">
          <div className="flex h-12 w-12 items-center justify-center rounded-[10px] bg-primary/15">
            <Shield className="h-6 w-6 text-primary" aria-hidden="true" />
          </div>
          <div>
            <CardTitle className="text-[18px] font-semibold leading-[22.68px]">
              Admin panel ready
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Protected routing, API client, and layout shell are configured.
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-[12px]">
          <p className="text-[16px] font-normal leading-[22px] text-foreground">
            This is the protected placeholder route for JAW-9579. Feature modules
            such as organizations, users, and analytics will connect to backend
            endpoints in follow-on tickets.
          </p>
          <div className="flex flex-wrap items-center gap-[10px]">
            <Badge variant="secondary" className="capitalize">
              {user?.role.replace(/_/g, " ")}
            </Badge>
            <Badge variant="outline">API client configured</Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-lg">Account overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Account email</span>
            <span className="font-medium">{user?.email}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Admin access</span>
            <Badge>Active</Badge>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Signed in as</span>
            <span className="font-medium">
              {user?.firstName} {user?.lastName}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
