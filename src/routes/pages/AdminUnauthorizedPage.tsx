import { Link } from 'react-router-dom';
import { ShieldX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';

export function AdminUnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <ShieldX className="h-5 w-5" aria-hidden="true" />
          </div>
          <h1 className="font-outfit text-body-25 text-foreground">Access denied</h1>
          <CardDescription>
            Your account does not have permission to access the Super Admin panel. Please sign in
            with an authorized account or contact your administrator.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="outline">
            <Link to="/admin/login">Return to sign in</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
