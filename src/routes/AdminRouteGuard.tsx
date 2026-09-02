import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export function AdminRouteGuard() {
  const { isLoading, isAuthenticated, isAdmin } = useAuth();

  if (!isLoading && (!isAuthenticated || !isAdmin)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
