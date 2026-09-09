import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function DashboardPlaceholderPage() {
  return (
    <div className="admin-dashboard-page w-full space-y-6">
      <PageHeader
        title="Super Admin Dashboard"
        description="Welcome to the Hoops Engine admin console."
      />
      <Card>
        <CardHeader>
          <CardTitle>Platform overview</CardTitle>
          <CardDescription>
            Manage organizations, users, subscription plans, and support requests from the sidebar.
            Analytics reporting is planned for a future release.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-body-sm text-muted-foreground">
            You are signed in with administrator access. Use Organizations, Users, Subscriptions,
            and Support in the sidebar to manage platform data. Analytics is coming soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
