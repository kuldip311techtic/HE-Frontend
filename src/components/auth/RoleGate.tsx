import { Navigate, Outlet } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface RoleGateProps {
  redirectTo?: string;
}

export function RoleGate({ redirectTo = '/admin/login' }: RoleGateProps) {
  const { isAuthenticated, hasAdminAccess, logout } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  if (!hasAdminAccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center gap-2 text-destructive">
              <ShieldAlert className="h-5 w-5" aria-hidden="true" />
              <CardTitle>Access denied</CardTitle>
            </div>
            <CardDescription>
              Your account does not have permission to access the admin panel.
              Only Admin and Super Admin roles are allowed.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Button variant="outline" onClick={logout} aria-label="Sign out">
              Sign out
            </Button>
            <Button asChild>
              <a href="/">Return home</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <Outlet />;
}
