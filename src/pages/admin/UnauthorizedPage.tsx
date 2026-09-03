import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';

export function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h1 className="font-outfit text-body-25">Access denied</h1>
          <CardDescription>
            You don&apos;t have permission to access the admin panel. Coach and Player roles are
            restricted to their respective applications.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            <Link to="/admin/login">Return to sign in</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
