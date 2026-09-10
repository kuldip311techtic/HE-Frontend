import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { api } from '@/lib/api';
import { AUTH_UNAUTHORIZED_EVENT, DEV_BYPASS_TOKEN } from '@/lib/auth/constants';
import { isAdminRole } from '@/lib/auth/isAdminRole';
import { normalizeAdminRole } from '@/lib/auth/normalizeAdminRole';
import {
  clearSession,
  clearSessionRejected,
  getSession,
  isSessionRejected,
  setSession,
} from '@/lib/auth/session';
import type { LoginResponse } from '@/types/api';
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

const DEV_BYPASS = import.meta.env.VITE_DEV_ADMIN_BYPASS === 'true';

const DEV_SESSION: AdminSession = {
  token: DEV_BYPASS_TOKEN,
  role: 'super_admin',
  email: 'dev@hoops.local',
  name: 'Dev Super Admin',
};

function displayNameFromUser(user: LoginResponse['user'], email: string): string {
  const first = user?.first_name?.trim() ?? '';
  const last = user?.last_name?.trim() ?? '';
  const combined = `${first} ${last}`.trim();
  if (combined) return combined;
  const local = (user?.email || email).split('@')[0];
  return local || 'Super Admin';
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AdminSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isSessionRejected()) {
      clearSession();
      setUser(null);
      setIsLoading(false);
      return;
    }

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

  useEffect(() => {
    const onUnauthorized = () => {
      setUser(null);
    };
    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, onUnauthorized);
    return () => window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, onUnauthorized);
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    if (!credentials.email.trim() || !credentials.password.trim()) {
      throw new Error('Email and password are required.');
    }

    if (DEV_BYPASS && !isSessionRejected()) {
      const session: AdminSession = {
        token: DEV_BYPASS_TOKEN,
        role: 'super_admin',
        email: credentials.email.trim(),
        name: credentials.email.split('@')[0] || 'Super Admin',
      };
      clearSessionRejected();
      setSession(session);
      setUser(session);
      return;
    }

    const data = await api.post<LoginResponse>(
      '/api/super-admin/login',
      { email: credentials.email.trim(), password: credentials.password },
      { skipAuth: true },
    );

    const token = data.access_token ?? data.token;
    if (!token) {
      throw new Error('Sign-in did not return a token.');
    }

    const apiUser = data.user;
    if (apiUser && apiUser.is_super_admin !== true && apiUser.role !== 'super_admin') {
      throw new Error('You do not have permission to access the Super Admin panel.');
    }

    const roleSource = apiUser?.role ?? 'super_admin';
    const role = normalizeAdminRole(roleSource);
    if (!role) {
      throw new Error('You do not have permission to access the Super Admin panel.');
    }

    const session: AdminSession = {
      token,
      role,
      email: apiUser?.email ?? credentials.email.trim(),
      name: displayNameFromUser(apiUser, credentials.email.trim()),
    };

    clearSessionRejected();
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
