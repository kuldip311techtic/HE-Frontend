import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { LoadingState } from '@/components/ui/loading-state';
import { useAuth } from '@/lib/auth/useAuth';

export function ProtectedRoute() {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingState label="Checking session…" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  if (!isAdmin) {
    return <Navigate to="/admin/unauthorized" replace />;
  }

  return <Outlet />;
}
