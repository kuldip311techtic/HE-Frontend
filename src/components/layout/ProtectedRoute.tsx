import { Navigate, Outlet } from 'react-router-dom';
import { LoadingState } from '@/components/ui/loading-state';
import { useAuth } from '@/lib/auth/useAuth';

export function ProtectedRoute() {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingState label="Checking session…" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/admin/unauthorized" replace />;
  }

  return <Outlet />;
}
