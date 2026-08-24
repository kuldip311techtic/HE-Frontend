import type { ReactNode } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { hasAdminAccess, isAuthenticated } from '../../hooks/useAuth';
import { clearAuth } from '../../lib/auth/session';
import { paths } from '../../routes/paths';
import Button from '../ui/Button';
import EmptyState from '../ui/EmptyState';

interface RoleGateProps {
  children: ReactNode;
}

export default function RoleGate({ children }: RoleGateProps) {
  const location = useLocation();
  const navigate = useNavigate();

  if (!isAuthenticated()) {
    return <Navigate to={paths.login} replace state={{ from: location }} />;
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
              navigate(paths.login, { replace: true });
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
