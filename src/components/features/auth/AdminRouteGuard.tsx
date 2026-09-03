import { Navigate, Outlet } from 'react-router-dom';
import { LoadingState } from '@/components/ui/loading-state';
import { useAdminAuth } from '@/lib/auth/AdminAuthProvider';

export function AdminRouteGuard() {
  const { isAuthenticated, isAdmin, isHydrating, isValidationBypass } = useAdminAuth();

  if (isHydrating) {
    return <LoadingState message="Checking authentication…" fullPage />;
  }

  const canAccessAdmin =
    (isAuthenticated && isAdmin) || (isValidationBypass && isAdmin);

  if (!canAccessAdmin) {
    if (!isAuthenticated && !isValidationBypass) {
      return <Navigate to="/admin/login" replace />;
    }

    return <Navigate to="/admin/unauthorized" replace />;
  }

  return <Outlet />;
}
