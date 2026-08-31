import { Navigate, useLocation } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { hasAdminAccess } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface RoleGateProps {
  children: React.ReactNode;
}

export function RoleGate({ children }: RoleGateProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-md space-y-4" aria-busy="true" aria-label="Loading authentication">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  const roles = user.roles.length > 0 ? user.roles : [user.role];

  if (!hasAdminAccess(roles)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
              <ShieldAlert
                className="h-5 w-5 text-destructive"
                aria-hidden="true"
              />
            </div>
            <CardTitle>Access denied</CardTitle>
            <CardDescription>
              Your account does not have permission to access the admin panel.
              Only Admin and Super Admin roles are allowed.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              onClick={() => {
                window.location.href = '/';
              }}
              aria-label="Return to home"
            >
              Return to home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
