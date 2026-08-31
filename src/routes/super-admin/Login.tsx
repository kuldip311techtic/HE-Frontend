import { LoginForm } from '@/components/LoginForm';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function SuperAdminLogin() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Hoops Engine
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
            Super Admin
          </h1>
        </div>

        <Card className="border-border/60 bg-card/95 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl font-semibold">Sign in</CardTitle>
            <CardDescription>
              Enter your credentials to access the admin dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
