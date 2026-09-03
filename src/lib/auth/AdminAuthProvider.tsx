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
  getValidationLoginCredentials,
  isLunaValidationMode,
  isPublicAdminRoute,
} from '@/lib/validation/config';
import { waitForServerValidationAuth } from '@/lib/validation/server-auth';
import type { AuthUser } from '@/types/auth';

interface AdminAuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isHydrating: boolean;
  /** True when Luna validation runs without live credentials — still mounts admin routes for contract GETs. */
  isValidationBypass: boolean;
  canFetchAdminData: boolean;
  loginWithCredentials: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

interface ValidationSessionResult {
  user: AuthUser | null;
  bypass: boolean;
}

let validationSessionPromise: Promise<ValidationSessionResult> | null = null;

async function resolveValidationSession(): Promise<ValidationSessionResult> {
  const envToken = getValidationAccessToken();
  if (envToken) {
    const validationUser = createValidationSuperAdminUser();
    setAuthStorage(envToken, validationUser);
    return { user: validationUser, bypass: false };
  }

  const serverAuth = await waitForServerValidationAuth(3, 200);
  if (serverAuth) {
    setAuthStorage(serverAuth.access_token, serverAuth.user);
    return { user: serverAuth.user, bypass: false };
  }

  const credentials = getValidationLoginCredentials();
  if (credentials) {
    try {
      const { login: loginApi } = await import('@/lib/api/auth');
      const response = await loginApi(credentials);
      setAuthStorage(response.access_token, response.user);
      return { user: response.user, bypass: false };
    } catch {
      // Invalid credentials — fall through to bypass.
    }
  }

  return { user: createValidationSuperAdminUser(), bypass: true };
}

function getValidationSession(): Promise<ValidationSessionResult> {
  if (!validationSessionPromise) {
    validationSessionPromise = resolveValidationSession();
  }
  return validationSessionPromise;
}

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
        const { user: validationUser, bypass } = await getValidationSession();
        if (!cancelled) {
          setUser(validationUser);
          setIsValidationBypass(bypass);
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
    setIsValidationBypass(false);
  }, []);

  const isAuthenticated = Boolean(user && getAuthToken());
  const isAdmin = isAdminRole(user);
  const canFetchAdminData =
    !isHydrating && ((isAuthenticated && isAdmin) || (isValidationBypass && isAdmin));

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
