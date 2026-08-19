import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { AUTH_QUERY_KEY } from '../lib/api/queryKeys';
import apiClient from '../lib/api/client';
import {
  clearAuth,
  getStoredEmail,
  getStoredToken,
  hasAdminAccess,
  isAuthenticated,
  persistSession,
} from '../lib/auth/session';
import { paths } from '../routes/paths';
import type { ErrorResponse, LoginRequest, LoginResponse } from '../types/api';

export { AUTH_QUERY_KEY } from '../lib/api/queryKeys';
export {
  clearAuth,
  getStoredEmail,
  getStoredToken,
  hasAdminAccess,
  isAuthenticated,
};

export const DASHBOARD_PATH = paths.dashboard;

const DEFAULT_LOGIN_ERROR = 'Incorrect email or password.';
const NETWORK_LOGIN_ERROR =
  'Unable to sign in. Check your connection and try again.';

export function getAuthErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ErrorResponse>(error)) {
    if (!error.response) {
      return NETWORK_LOGIN_ERROR;
    }

    return error.response.data?.message ?? DEFAULT_LOGIN_ERROR;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return DEFAULT_LOGIN_ERROR;
}

async function loginRequest(credentials: LoginRequest): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>(
    '/auth/login',
    credentials,
  );

  if (!data.success) {
    throw new Error(data.message || DEFAULT_LOGIN_ERROR);
  }

  return data;
}

export function useAuth() {
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationKey: AUTH_QUERY_KEY,
    mutationFn: loginRequest,
    onSuccess: (response) => {
      persistSession(response);
      navigate(DASHBOARD_PATH, { replace: true });
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
