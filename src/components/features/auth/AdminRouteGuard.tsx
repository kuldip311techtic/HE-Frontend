import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/auth/useAuth';
import { LoadingState } from '@/components/ui/LoadingState';

export function AdminRouteGuard() {
  const { isLoading, isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingState label="Checking access…" className="min-h-screen" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  if (!isAdmin) {
    return <Navigate to="/admin/unauthorized" replace />;
  }

  return <Outlet />;
}
