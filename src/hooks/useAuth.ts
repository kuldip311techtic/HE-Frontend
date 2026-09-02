import { useCallback, useEffect, useMemo, useState } from 'react';
import { hasAdminAccess } from '@/lib/auth/roles';
import {
  clearAuthStorage,
  getStoredToken,
  getStoredUser,
  setStoredToken,
  setStoredUser,
} from '@/lib/auth/storage';
import type { AuthState, User, UserRole } from '@/types';

interface UseAuthReturn extends AuthState {
  login: (token: string, user: User) => void;
  logout: () => void;
  hasRole: (role: UserRole) => boolean;
  isAdmin: boolean;
}

export function useAuth(): UseAuthReturn {
  const [state, setState] = useState<AuthState>(() => ({
    user: getStoredUser(),
    token: getStoredToken(),
    isAuthenticated: Boolean(getStoredToken()),
    isLoading: true,
  }));

  useEffect(() => {
    const token = getStoredToken();
    const user = getStoredUser();
    setState({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      isLoading: false,
    });
  }, []);

  const login = useCallback((token: string, user: User) => {
    setStoredToken(token);
    setStoredUser(user);
    setState({
      user,
      token,
      isAuthenticated: true,
      isLoading: false,
    });
  }, []);

  const logout = useCallback(() => {
    clearAuthStorage();
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);

  const hasRole = useCallback(
    (role: UserRole) => {
      if (!state.user) return false;
      return state.user.role === role || state.user.roles.includes(role);
    },
    [state.user],
  );

  const isAdmin = useMemo(() => {
    if (!state.user) return false;
    return hasAdminAccess([state.user.role, ...state.user.roles]);
  }, [state.user]);

  return {
    ...state,
    login,
    logout,
    hasRole,
    isAdmin,
  };
}
