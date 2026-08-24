import { Navigate } from "react-router-dom";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoginForm } from "@/components/LoginForm";
import { getStoredToken } from "@/lib/utils";

export default function SuperAdminLogin() {
  if (getStoredToken()) {
    return <Navigate to="/super-admin/dashboard" replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <Card className="shadow-md">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold tracking-tight">
              Super Admin Sign In
            </CardTitle>
            <CardDescription>
              Sign in to manage organizations, coaches, and players in Hoops
              Engine.
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
