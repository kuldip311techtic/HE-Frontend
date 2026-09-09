import { Navigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth/useAuth';
import { LoadingState } from '@/components/ui/LoadingState';

export function RootRedirect() {
  const { isLoading, isAuthenticated, isAdmin } = useAuth();

  if (isLoading) {
    return <LoadingState className="min-h-screen" />;
  }

  if (isAuthenticated && isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Navigate to="/admin/login" replace />;
}
