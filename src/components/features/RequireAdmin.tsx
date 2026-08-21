import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { Spinner } from "@/components/ui/Spinner";
import { useAuth } from "@/hooks/useAuth";

export function RequireAdmin({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { status, isAuthenticated, isAdmin } = useAuth();

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner label="Checking session" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  if (!isAdmin) {
    return <Navigate to="/admin/unauthorized" replace />;
  }

  return children;
}
