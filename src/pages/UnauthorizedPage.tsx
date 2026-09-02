import { ShieldX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';

export function UnauthorizedPage() {
  const { setDemoAdminSession, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleDemoLogin = () => {
    setDemoAdminSession();
    navigate('/admin');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/20">
            <ShieldX className="h-6 w-6 text-destructive" aria-hidden="true" />
          </div>
          <CardTitle className="text-2xl font-semibold">
            {isAuthenticated && !isAdmin
              ? 'Access Denied'
              : 'Authentication Required'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-sm text-muted-foreground">
            {isAuthenticated && !isAdmin
              ? 'Your account does not have admin privileges. Only Organization Admin and Super Admin roles can access this panel.'
              : 'You must sign in with an admin account to access the organization admin panel.'}
          </p>
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button onClick={handleDemoLogin}>
              Continue as Demo Admin
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
