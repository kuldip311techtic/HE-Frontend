import { Navigate, Outlet } from 'react-router-dom';
import { LoadingState } from '@/components/ui/loading-state';
import { useAdminAuth } from '@/lib/auth/AdminAuthProvider';

export function AdminRouteGuard() {
  const { isAuthenticated, isAdmin, isHydrating } = useAdminAuth();

  if (isHydrating) {
    return <LoadingState message="Checking authentication…" fullPage />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/admin/unauthorized" replace />;
  }

  return <Outlet />;
}
