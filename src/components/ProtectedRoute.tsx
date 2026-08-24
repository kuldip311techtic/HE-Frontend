import { Navigate, useLocation } from "react-router-dom";

import { getStoredToken } from "@/lib/utils";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  const token = getStoredToken();

  if (!token) {
    return (
      <Navigate to="/super-admin/login" state={{ from: location }} replace />
    );
  }

  return <>{children}</>;
}
