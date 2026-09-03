import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import {
  clearAuthStorage,
  getStoredUser,
  getToken,
  setStoredUser,
  setToken,
} from '@/lib/auth/token-storage';
import type { AdminRole, AuthUser } from '@/types/auth';
import { getRoleLabel, isAdminRole } from '@/types/auth';

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isHydrating: boolean;
  login: (role: AdminRole) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function buildDemoUser(role: AdminRole): AuthUser {
  return {
    id: `demo-${role}`,
    name: getRoleLabel(role),
    role,
    email: `${role}@hoops-engine.demo`,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isHydrating, setIsHydrating] = useState(true);

  useEffect(() => {
    const token = getToken();
    const storedUser = getStoredUser<AuthUser>();
    if (token && storedUser) {
      setUser(storedUser);
    }
    setIsHydrating(false);
  }, []);

  const login = useCallback(async (role: AdminRole): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const demoUser = buildDemoUser(role);
    setToken(`demo-token-${role}`);
    setStoredUser(demoUser);
    setUser(demoUser);
    return isAdminRole(role);
  }, []);

  const logout = useCallback(() => {
    clearAuthStorage();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user && getToken()),
      isHydrating,
      login,
      logout,
    }),
    [user, isHydrating, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
