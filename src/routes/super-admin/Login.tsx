import { Navigate } from "react-router-dom";

import { LoginForm } from "@/components/LoginForm";
import { getStoredToken } from "@/lib/utils";

export default function SuperAdminLogin() {
  if (getStoredToken()) {
    return <Navigate to="/super-admin/dashboard" replace />;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-8">
      <div className="w-full max-w-md space-y-8">
        <header className="flex flex-col items-center text-center">
          <div
            className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/20"
            aria-hidden="true"
          >
            <span className="text-lg font-bold text-primary">HE</span>
          </div>
          <h1 className="text-2xl font-semibold text-foreground">
            Super Admin Sign In
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to manage organizations, coaches, and players in Hoops
            Engine.
          </p>
        </header>

        <div className="rounded-lg border border-border bg-card/50 p-6 shadow-md backdrop-blur-sm">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
