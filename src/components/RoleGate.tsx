import { Navigate } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';
import type { UserRole } from '@/types';

interface RoleGateProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

export function RoleGate({
  children,
  allowedRoles,
  redirectTo = '/access-denied',
}: RoleGateProps) {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-md space-y-4" aria-busy="true">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const roles = allowedRoles ?? (['super_admin', 'admin'] as UserRole[]);
  const hasAccess = roles.includes(user.role);

  if (!hasAccess) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}

export function AccessDeniedPage() {
  const { logout, user } = useAuth();

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2 text-destructive">
            <ShieldAlert className="h-5 w-5" aria-hidden="true" />
            <CardTitle>Access denied</CardTitle>
          </div>
          <CardDescription>
            You do not have permission to access the admin panel. Only Super Admin
            and Admin roles are allowed.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-3">
          <Button variant="outline" onClick={logout} aria-label="Sign out">
            Sign out
          </Button>
          {user && (
            <p className="self-center text-sm text-muted-foreground">
              Signed in as {user.email} ({user.role})
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
