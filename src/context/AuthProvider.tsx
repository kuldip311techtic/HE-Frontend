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
  isSuperAdminUser,
  loginWithEmail,
  mapUserPublicToAuthUser,
  SUPER_ADMIN_ACCESS_DENIED_MESSAGE,
} from '@/lib/api/auth';
import {
  clearAuthStorage,
  getStoredUser,
  getToken,
  setStoredUser,
  setToken,
} from '@/lib/auth/token-storage';
import type { AuthUser } from '@/types/auth';

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isHydrating: boolean;
  loginWithCredentials: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

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

  const loginWithCredentials = useCallback(async (email: string, password: string): Promise<void> => {
    const response = await loginWithEmail({ email, password });

    if (!isSuperAdminUser(response.user)) {
      throw new Error(SUPER_ADMIN_ACCESS_DENIED_MESSAGE);
    }

    const authUser = mapUserPublicToAuthUser(response.user);
    setToken(response.access_token);
    setStoredUser(authUser);
    setUser(authUser);
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
      loginWithCredentials,
      logout,
    }),
    [user, isHydrating, loginWithCredentials, logout],
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
