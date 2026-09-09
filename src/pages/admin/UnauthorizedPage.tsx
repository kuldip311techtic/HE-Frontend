import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Access denied</CardTitle>
          <CardDescription>
            You don&apos;t have permission to access the Super Admin console. Contact your platform
            administrator if you believe this is an error.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="brand" className="w-full">
            <Link to="/admin/login">Return to sign in</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
