import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { superAdminLogin } from '@/lib/api/superAdmin';
import { isAdminRole } from '@/lib/auth/isAdminRole';
import { normalizeLoginResponse } from '@/lib/auth/normalizeLoginResponse';
import { isDevAdminBypassEnabled } from '@/lib/auth/devBypass';
import { clearSession, getSession, setSession } from '@/lib/auth/session';
import type { AdminSession, LoginCredentials } from '@/types/auth';

interface AuthContextValue {
  user: AdminSession | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

const DEV_BYPASS = isDevAdminBypassEnabled();

const DEV_SESSION: AdminSession = {
  token: 'dev-bypass',
  role: 'super_admin',
  email: 'dev@hoops.local',
  name: 'Dev Super Admin',
};

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AdminSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const existing = getSession();
    if (existing) {
      setUser(existing);
      setIsLoading(false);
      return;
    }

    if (DEV_BYPASS) {
      setSession(DEV_SESSION);
      setUser(DEV_SESSION);
    }

    setIsLoading(false);
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    if (!credentials.email.trim() || !credentials.password.trim()) {
      throw new Error('Email and password are required.');
    }

    if (DEV_BYPASS) {
      const session: AdminSession = {
        token: 'dev-bypass',
        role: 'super_admin',
        email: credentials.email.trim(),
        name: credentials.email.split('@')[0] || 'Super Admin',
      };
      setSession(session);
      setUser(session);
      return;
    }

    const response = await superAdminLogin({
      email: credentials.email.trim(),
      password: credentials.password,
    });
    const session = normalizeLoginResponse(response, credentials.email.trim());
    setSession(session);
    setUser(session);
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user?.token),
      isAdmin: isAdminRole(user?.role),
      login,
      logout,
    }),
    [user, isLoading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
