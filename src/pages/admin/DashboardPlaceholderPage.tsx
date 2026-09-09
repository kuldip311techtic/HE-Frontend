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
            Analytics, organizations, users, and subscription modules will be available in upcoming
            releases. Use the sidebar to preview planned navigation destinations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-body-sm text-muted-foreground">
            You are signed in with administrator access. Feature modules such as Organizations,
            Users, Subscriptions, Support, and Analytics are coming soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
