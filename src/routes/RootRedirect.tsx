import { Navigate } from 'react-router-dom';
import { LoadingState } from '@/components/ui/loading-state';
import { useAuth } from '@/lib/auth/useAuth';

export function RootRedirect() {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingState label="Loading…" />;
  }

  if (isAuthenticated && isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Navigate to="/admin/login" replace />;
}
