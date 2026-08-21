import { Link } from "react-router-dom";

import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";

export function UnauthorizedPage() {
  const { logout } = useAuth();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div
        role="alert"
        className="w-full max-w-md rounded-lg border border-error-border bg-error-background p-6 shadow-md"
      >
        <h1 className="text-xl font-semibold text-error">Access denied</h1>
        <p className="mt-2 text-sm text-foreground">
          This panel is limited to Admin and Super Admin roles.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link to="/admin/login" className="inline-flex">
            <Button onClick={logout} className="w-full">
              Sign in
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
