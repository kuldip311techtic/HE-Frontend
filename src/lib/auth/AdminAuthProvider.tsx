import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useQueryClient } from '@tanstack/react-query';
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
import { watchServerValidationAuth } from '@/lib/validation/server-auth';
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

interface InitialAuthState {
  user: AuthUser | null;
  isHydrating: boolean;
  isValidationBypass: boolean;
}

/**
 * Resolve auth synchronously on first paint so protected routes mount immediately
 * during Luna validation capture (no blocking wait on auth-json polling).
 */
function readInitialAuthState(): InitialAuthState {
  if (typeof window === 'undefined') {
    return { user: null, isHydrating: true, isValidationBypass: false };
  }

  const onPublicRoute = isPublicAdminRoute();
  const token = getAuthToken();
  const storedUser = getStoredUser();

  if (onPublicRoute) {
    return {
      user: token && storedUser ? storedUser : null,
      isHydrating: false,
      isValidationBypass: false,
    };
  }

  if (token && storedUser) {
    return {
      user: storedUser,
      isHydrating: false,
      isValidationBypass: false,
    };
  }

  if (isLunaValidationMode()) {
    const envToken = getValidationAccessToken();
    if (envToken) {
      const validationUser = createValidationSuperAdminUser();
      setAuthStorage(envToken, validationUser);
      return {
        user: validationUser,
        isHydrating: false,
        isValidationBypass: false,
      };
    }

    return {
      user: createValidationSuperAdminUser(),
      isHydrating: false,
      isValidationBypass: true,
    };
  }

  return {
    user: null,
    isHydrating: false,
    isValidationBypass: false,
  };
}

const initialAuthState = readInitialAuthState();

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<AuthUser | null>(initialAuthState.user);
  const [isHydrating] = useState(initialAuthState.isHydrating);
  const [isValidationBypass, setIsValidationBypass] = useState(
    initialAuthState.isValidationBypass,
  );

  useEffect(() => {
    if (!isLunaValidationMode() || isPublicAdminRoute() || getAuthToken()) {
      return;
    }

    const stopWatching = watchServerValidationAuth(
      (serverAuth) => {
        setAuthStorage(serverAuth.access_token, serverAuth.user);
        setUser(serverAuth.user);
        setIsValidationBypass(false);
        void queryClient.invalidateQueries();
      },
      { startAttempt: 0 },
    );

    return stopWatching;
  }, [queryClient]);

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
    !isHydrating &&
    isAdmin &&
    (isAuthenticated || (isValidationBypass && isLunaValidationMode()));

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
