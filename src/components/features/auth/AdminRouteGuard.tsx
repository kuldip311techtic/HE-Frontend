import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/lib/auth/useAuth';
import { LoadingState } from '@/components/ui/LoadingState';

export function AdminRouteGuard() {
  const { isLoading, isAuthenticated, isAdmin } = useAuth();

  if (isLoading) {
    return <LoadingState label="Checking access…" className="min-h-screen" />;
  }

  if (isAuthenticated && !isAdmin) {
    return <Navigate to="/admin/unauthorized" replace />;
  }

  return <Outlet />;
}
