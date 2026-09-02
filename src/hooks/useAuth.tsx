import {
  createContext,
  useCallback,
  useContext,
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
import type { AuthSession, AuthUser, UserRole } from '@/types/auth';

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (session: AuthSession) => void;
  logout: () => void;
  setDemoAdminSession: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const DEMO_ADMIN_USER: AuthUser = {
  id: 'demo-admin-1',
  email: 'admin@hoopsengine.com',
  firstName: 'Alex',
  lastName: 'Morgan',
  name: 'Alex Morgan',
  role: 'organization_admin',
  roles: ['organization_admin'],
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = getStoredToken();
    const storedUser = getStoredUser<AuthUser>();

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
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

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function useHasRole(role: UserRole): boolean {
  const { user } = useAuth();
  if (!user) return false;
  const roles = user.roles?.length ? user.roles : [user.role];
  return roles.includes(role);
}
