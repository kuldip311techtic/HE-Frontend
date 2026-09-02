import { type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import type { UserRole } from "@/types/auth";
import { userHasAdminAccess } from "@/types/auth";

interface RoleGateProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
  fallbackPath?: string;
}

export function RoleGate({
  children,
  allowedRoles,
  fallbackPath = "/admin/unauthorized",
}: RoleGateProps) {
  const { user, isLoading, isAuthenticated, hasAdminAccess } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-background"
        role="status"
        aria-label="Loading authentication"
      >
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  const hasRequiredRole = allowedRoles
    ? allowedRoles.includes(user.role) ||
      user.roles.some((r) => allowedRoles.includes(r))
    : hasAdminAccess;

  if (!hasRequiredRole || !userHasAdminAccess(user)) {
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
}
