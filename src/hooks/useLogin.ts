import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginSuperAdmin } from '@/services/auth';
import { ApiClientError } from '@/services/api-client';
import type { LoginRequest } from '@/types';

interface UseLoginResult {
  login: (credentials: LoginRequest) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

export function useLogin(): UseLoginResult {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const login = useCallback(
    async (credentials: LoginRequest) => {
      setIsLoading(true);
      setError(null);

      try {
        await loginSuperAdmin(credentials);
        navigate('/super-admin/dashboard', { replace: true });
      } catch (err) {
        if (err instanceof ApiClientError) {
          setError(err.message);
        } else {
          setError('Unable to sign in. Please check your connection and try again.');
        }
      } finally {
        setIsLoading(false);
      }
    },
    [navigate],
  );

  return { login, isLoading, error, clearError };
}
