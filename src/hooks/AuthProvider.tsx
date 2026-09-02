import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { canAccessAdmin } from '@/lib/auth/roles';
import {
  clearAuthStorage,
  getStoredToken,
  getStoredUser,
  setStoredToken,
  setStoredUser,
} from '@/lib/auth/storage';
import { getAutoDemoSession } from '@/lib/dev-auth';
import type { AuthSession } from '@/types/auth';
import {
  AuthContext,
  DEMO_ADMIN_USER,
  type AuthContextValue,
} from '@/hooks/auth-context';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthContextValue['user']>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = getStoredToken();
    const storedUser = getStoredUser<AuthContextValue['user']>();

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
    } else {
      const demoSession = getAutoDemoSession();
      if (demoSession) {
        setStoredToken(demoSession.token);
        setStoredUser(demoSession.user);
        setToken(demoSession.token);
        setUser(demoSession.user);
      }
    }

    setIsLoading(false);
  }, []);

  const login = useCallback((session: AuthSession) => {
    setStoredToken(session.token);
    setStoredUser(session.user);
    setToken(session.token);
    setUser(session.user);
  }, []);

  const logout = useCallback(() => {
    clearAuthStorage();
    setToken(null);
    setUser(null);
  }, []);

  const setDemoAdminSession = useCallback(() => {
    const demoSession: AuthSession = {
      token: 'demo-admin-token',
      user: DEMO_ADMIN_USER,
    };
    login(demoSession);
  }, [login]);

  const isAdmin = user ? canAccessAdmin(user) : false;

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isLoading,
      isAuthenticated: Boolean(token && user),
      isAdmin,
      login,
      logout,
      setDemoAdminSession,
    }),
    [user, token, isLoading, isAdmin, login, logout, setDemoAdminSession],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}
