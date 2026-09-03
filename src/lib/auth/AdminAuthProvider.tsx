import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { login as loginApi } from '@/lib/api/auth';
import {
  clearAuthStorage,
  getAuthToken,
  getStoredUser,
  setAuthStorage,
} from '@/lib/auth/auth-storage';
import { isAdminRole } from '@/lib/auth/roles';
import type { AuthUser } from '@/types/auth';

interface AdminAuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isHydrating: boolean;
  loginWithCredentials: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isHydrating, setIsHydrating] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function hydrateSession() {
      const token = getAuthToken();
      const storedUser = getStoredUser();
      if (token && storedUser) {
        setUser(storedUser);
      } else {
        const email = import.meta.env.VITE_LUNA_VALIDATION_EMAIL;
        const password = import.meta.env.VITE_LUNA_VALIDATION_PASSWORD;
        if (email && password) {
          try {
            const response = await loginApi({ email, password });
            if (!cancelled) {
              setAuthStorage(response.access_token, response.user);
              setUser(response.user);
            }
          } catch {
            // Validation credentials unavailable — public routes still render.
          }
        }
      }

      if (!cancelled) {
        setIsHydrating(false);
      }
    }

    void hydrateSession();

    return () => {
      cancelled = true;
    };
  }, []);

  const loginWithCredentials = useCallback(async (email: string, password: string) => {
    const response = await loginApi({ email, password });
    setAuthStorage(response.access_token, response.user);
    setUser(response.user);
  }, []);

  const logout = useCallback(() => {
    clearAuthStorage();
    setUser(null);
  }, []);

  const value = useMemo<AdminAuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user && getAuthToken()),
      isAdmin: isAdminRole(user),
      isHydrating,
      loginWithCredentials,
      logout,
    }),
    [user, isHydrating, loginWithCredentials, logout],
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth(): AdminAuthContextValue {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
}
