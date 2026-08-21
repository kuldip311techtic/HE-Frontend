import type { ReactNode } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { hasAdminAccess, isAuthenticated } from '../../hooks/useAuth';
import { clearAuth } from '../../lib/auth/session';
import Button from '../ui/Button';
import EmptyState from '../ui/EmptyState';
import { adminPaths } from '../../routes/admin';

interface RoleGateProps {
  children: ReactNode;
}

function RoleGate({ children }: RoleGateProps) {
  const location = useLocation();
  const navigate = useNavigate();

  if (!isAuthenticated()) {
    return <Navigate to={adminPaths.login} replace state={{ from: location }} />;
  }

  if (!hasAdminAccess()) {
    return (
      <main className="grid min-h-screen place-items-center bg-canvas px-4 py-10">
        <div className="w-full max-w-md space-y-5">
          <EmptyState
            title="Access denied"
            description="This dashboard is limited to Admin and Super Admin roles."
          />
          <Button
            type="button"
            onClick={() => {
              clearAuth();
              navigate(adminPaths.login, { replace: true });
            }}
          >
            Return to sign in
          </Button>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  return <RoleGate>{children}</RoleGate>;
}
