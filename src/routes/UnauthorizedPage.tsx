import { Link } from 'react-router-dom';
import { ShieldX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="items-center">
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <ShieldX className="h-6 w-6" aria-hidden="true" />
          </div>
          <h1 className="text-[22px] font-semibold leading-none tracking-tight">Access Denied</h1>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            You do not have permission to access the admin panel.
          </p>
          <Button asChild variant="outline">
            <Link to="/admin/login">Back To Sign In</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
