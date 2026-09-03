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
import {
  createValidationSuperAdminUser,
  getValidationLoginCredentials,
  isLunaValidationMode,
  LUNA_VALIDATION_PROBE_TOKEN,
} from '@/lib/validation/config';
import { probeSuperAdminContractGets } from '@/lib/validation/contract-probe';
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
        if (!cancelled) {
          setUser(storedUser);
        }
      } else {
        const validationToken = import.meta.env.VITE_LUNA_VALIDATION_ACCESS_TOKEN?.trim();
        if (validationToken) {
          const validationUser = createValidationSuperAdminUser();
          if (!cancelled) {
            setAuthStorage(validationToken, validationUser);
            setUser(validationUser);
          }
        } else {
          const credentials = getValidationLoginCredentials();
          if (credentials) {
            try {
              const response = await loginApi(credentials);
              if (!cancelled) {
                setAuthStorage(response.access_token, response.user);
                setUser(response.user);
              }
            } catch {
              // Dev validation: mount protected routes and issue contract GETs when login fails.
              if (!cancelled && import.meta.env.DEV && isLunaValidationMode()) {
                const validationUser = createValidationSuperAdminUser(credentials.email);
                setAuthStorage(LUNA_VALIDATION_PROBE_TOKEN, validationUser);
                setUser(validationUser);
              }
            }
          }
        }
      }

      if (!cancelled && isLunaValidationMode()) {
        await probeSuperAdminContractGets();
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
