import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { setSessionExpiredHandler } from '@/lib/api/interceptors';
import { useAdminAuth } from '@/lib/auth/AdminAuthProvider';

/** Clears auth state and redirects to login when the API returns 401 for an authenticated request. */
export function SessionExpiryHandler() {
  const { logout } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setSessionExpiredHandler(() => {
      logout();
      toast.error('Your session has expired. Please sign in again.');
      navigate('/admin/login', { replace: true });
    });

    return () => {
      setSessionExpiredHandler(null);
    };
  }, [logout, navigate]);

  return null;
}
