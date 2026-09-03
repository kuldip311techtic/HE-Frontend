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
  getAuthToken,
  getStoredUser,
  setAuthStorage,
} from '@/lib/auth/auth-storage';
import { isAdminRole } from '@/lib/auth/roles';
import {
  createValidationSuperAdminUser,
  getValidationAccessToken,
  isLunaValidationMode,
  isPublicAdminRoute,
} from '@/lib/validation/config';
import { getServerValidationAuth } from '@/lib/validation/server-auth';
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

async function resolveValidationSession(): Promise<AuthUser | null> {
  const envToken = getValidationAccessToken();
  if (envToken) {
    const validationUser = createValidationSuperAdminUser();
    setAuthStorage(envToken, validationUser);
    return validationUser;
  }

  const serverAuth = await getServerValidationAuth();
  if (serverAuth) {
    setAuthStorage(serverAuth.access_token, serverAuth.user);
    return serverAuth.user;
  }

  return null;
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isHydrating, setIsHydrating] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function hydrateSession() {
      const token = getAuthToken();
      const storedUser = getStoredUser();
      const onPublicRoute = isPublicAdminRoute();

      if (onPublicRoute) {
        if (token && storedUser) {
          if (!cancelled) {
            setUser(storedUser);
          }
        } else if (!cancelled) {
          setUser(null);
        }

        if (!cancelled) {
          setIsHydrating(false);
        }
        return;
      }

      if (token && storedUser) {
        if (!cancelled) {
          setUser(storedUser);
          setIsHydrating(false);
        }
        return;
      }

      if (isLunaValidationMode()) {
        const validationUser = await resolveValidationSession();
        if (!cancelled) {
          setUser(validationUser);
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
    const { login: loginApi } = await import('@/lib/api/auth');
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
