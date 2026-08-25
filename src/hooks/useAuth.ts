import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { login as loginRequest } from '@/lib/api/auth';
import { AUTH_QUERY_KEY } from '@/lib/api/queryKeys';
import {
  clearAuth,
  getStoredEmail,
  getStoredToken,
  hasAdminAccess,
  isAuthenticated,
  persistSession,
} from '@/lib/auth/session';
import { paths } from '@/routes/paths';
import { ApiError, type LoginRequest } from '@/types/api';

export { AUTH_QUERY_KEY } from '@/lib/api/queryKeys';
export {
  clearAuth,
  getStoredEmail,
  getStoredToken,
  hasAdminAccess,
  isAuthenticated,
};

const DEFAULT_LOGIN_ERROR = 'Incorrect email or password.';
const NETWORK_LOGIN_ERROR =
  'Unable to sign in. Check your connection and try again.';

export function getAuthErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 0) {
      return NETWORK_LOGIN_ERROR;
    }

    return error.message || DEFAULT_LOGIN_ERROR;
  }

  if (error instanceof TypeError) {
    return NETWORK_LOGIN_ERROR;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return DEFAULT_LOGIN_ERROR;
}

export function useAuth() {
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationKey: AUTH_QUERY_KEY,
    mutationFn: (credentials: LoginRequest) => loginRequest(credentials),
    onSuccess: (response) => {
      persistSession(response);
      const redirectPath = response.data.redirect_to || paths.dashboard;
      navigate(redirectPath, { replace: true });
    },
  });

  return {
    login: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error ? getAuthErrorMessage(mutation.error) : null,
    reset: mutation.reset,
  };
}
