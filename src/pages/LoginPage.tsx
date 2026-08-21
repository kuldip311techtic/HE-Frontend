import { Navigate } from "react-router-dom";

import { LoginForm } from "@/components/ui/LoginForm";
import { useAuth } from "@/hooks/useAuth";

export function LoginPage() {
  const { isAuthenticated, isAdmin } = useAuth();

  if (isAuthenticated && isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-8 sm:px-6">
      <section
        aria-labelledby="login-heading"
        className="w-full max-w-md rounded-lg border border-border bg-surface p-6 shadow-md sm:p-8"
      >
        <p className="text-sm font-medium text-primary">Hoops Engine</p>
        <h1
          id="login-heading"
          className="mt-2 text-2xl font-semibold text-foreground"
        >
          Super Admin login
        </h1>
        <p className="mt-2 text-sm text-muted">
          Enter your email and password to access the dashboard.
        </p>
        <div className="mt-6">
          <LoginForm />
        </div>
      </section>
    </main>
  );
}
