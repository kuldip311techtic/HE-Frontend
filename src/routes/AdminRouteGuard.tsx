import { Navigate, Outlet } from 'react-router-dom';
import { LoadingIndicator } from '@/components/ui/LoadingIndicator';
import { useAuth } from '@/hooks/useAuth';

export function AdminRouteGuard() {
  const { isLoading, isAuthenticated, isAdmin } = useAuth();

  if (isLoading) {
    return <LoadingIndicator fullPage label="Checking access…" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
