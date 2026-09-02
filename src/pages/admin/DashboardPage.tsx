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
    <div className="w-full space-y-[16px] font-outfit">
      <PageHeader title={pageTitle} description={pageDescription} />

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
              ? "You have platform-wide access. Analytics, organizations, and user management will be available from this dashboard as modules are enabled."
              : "You can manage your organization profile, teams, and coaches from the navigation. Changes you make here apply across your organization."}
          </p>
          <div className="flex flex-wrap items-center gap-[10px]">
            <Badge variant="secondary" className="text-body-sm capitalize">
              {user?.role.replace(/_/g, " ")}
            </Badge>
            <Badge variant="outline" className="text-body-sm">
              Admin access active
            </Badge>
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
