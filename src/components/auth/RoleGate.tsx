import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

import { LoadingState } from '@/components/ui/loading-state';
import { useAuth } from '@/hooks/useAuth';
import { isAdminRole } from '@/types/auth';

interface RoleGateProps {
  children: ReactNode;
}

export function RoleGate({ children }: RoleGateProps) {
  const { user, isAuthenticated, isHydrating } = useAuth();
  const location = useLocation();

  if (isHydrating) {
    return <LoadingState message="Checking access…" />;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  if (!isAdminRole(user.role)) {
    return <Navigate to="/admin/unauthorized" replace />;
  }

  return <>{children}</>;
}
