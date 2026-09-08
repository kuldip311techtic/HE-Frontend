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
  isLunaValidationMode,
  isPublicAdminRoute,
} from '@/lib/validation/config';
import { ensureValidationAuth } from '@/lib/validation/ensure-validation-auth';
import type { AuthUser } from '@/types/auth';

interface AdminAuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isHydrating: boolean;
  isValidationBypass: boolean;
  canFetchAdminData: boolean;
  loginWithCredentials: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isHydrating, setIsHydrating] = useState(true);
  const [isValidationBypass, setIsValidationBypass] = useState(false);

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
        const authenticated = await ensureValidationAuth();
        if (!cancelled) {
          if (authenticated) {
            setUser(getStoredUser());
            setIsValidationBypass(false);
          } else {
            setUser(createValidationSuperAdminUser());
            setIsValidationBypass(true);
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
    const { login: loginApi } = await import('@/lib/api/auth');
    const response = await loginApi({ email, password });
    setAuthStorage(response.access_token, response.user);
    setUser(response.user);
    setIsValidationBypass(false);
  }, []);

  const logout = useCallback(() => {
    clearAuthStorage();
    setUser(null);
    setIsValidationBypass(false);
  }, []);

  const isAuthenticated = Boolean(user && getAuthToken());
  const isAdmin = isAdminRole(user);
  const canFetchAdminData =
    !isHydrating && isAdmin && (isAuthenticated || isValidationBypass);

  const value = useMemo<AdminAuthContextValue>(
    () => ({
      user,
      isAuthenticated,
      isAdmin,
      isHydrating,
      isValidationBypass,
      canFetchAdminData,
      loginWithCredentials,
      logout,
    }),
    [
      user,
      isAuthenticated,
      isAdmin,
      isHydrating,
      isValidationBypass,
      canFetchAdminData,
      loginWithCredentials,
      logout,
    ],
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
