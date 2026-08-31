import { SuperAdminLayout } from '@/components/SuperAdminLayout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getAuthUser } from '@/services/api-client';
import { logoutSuperAdmin } from '@/services/auth';
import { Button } from '@/components/Button';
import { Link } from 'react-router-dom';

export default function SuperAdminDashboard() {
  const user = getAuthUser();

  function handleLogout() {
    logoutSuperAdmin();
    window.location.href = '/super-admin/login';
  }

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Welcome back{user?.name ? `, ${user.name}` : ''}</CardTitle>
            <CardDescription>
              You are signed in as {user?.email}. Use the navigation to manage organizations,
              coaches, and players.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Signed in as{' '}
              <span className="font-medium text-foreground">{user?.email}</span>.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link to="/super-admin/manage-users">Manage Users</Link>
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                Sign out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </SuperAdminLayout>
  );
}
