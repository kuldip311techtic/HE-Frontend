import {
  createContext,
  useCallback,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import {
  clearAuthStorage,
  getStoredToken,
  getStoredUserRaw,
  setStoredToken,
  setStoredUserRaw,
} from '@/lib/auth/storage';
import { isAdminRole, type AuthState, type AuthUser } from '@/types/auth';

export interface AuthContextValue extends AuthState {
  login: (user: AuthUser, token: string) => void;
  logout: () => void;
  hasAdminAccess: boolean;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

const AUTH_EVENT = 'he-admin-auth-change';

function parseStoredUser(raw: string | null): AuthUser | null {
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as AuthUser;
    if (
      typeof parsed.id === 'string' &&
      typeof parsed.email === 'string' &&
      typeof parsed.name === 'string' &&
      typeof parsed.role === 'string'
    ) {
      return parsed;
    }
  } catch {
    return null;
  }

  return null;
}

function readAuthState(): AuthState {
  const token = getStoredToken();
  const user = parseStoredUser(getStoredUserRaw());

  return {
    token,
    user,
    isAuthenticated: Boolean(token && user),
  };
}

function subscribe(callback: () => void): () => void {
  const handler = () => callback();
  window.addEventListener('storage', handler);
  window.addEventListener(AUTH_EVENT, handler);
  return () => {
    window.removeEventListener('storage', handler);
    window.removeEventListener(AUTH_EVENT, handler);
  };
}

function notifyAuthChange(): void {
  window.dispatchEvent(new Event(AUTH_EVENT));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const authState = useSyncExternalStore(subscribe, readAuthState, readAuthState);

  const login = useCallback((user: AuthUser, token: string) => {
    setStoredToken(token);
    setStoredUserRaw(JSON.stringify(user));
    notifyAuthChange();
  }, []);

  const logout = useCallback(() => {
    clearAuthStorage();
    notifyAuthChange();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      ...authState,
      login,
      logout,
      hasAdminAccess: authState.user ? isAdminRole(authState.user.role) : false,
    }),
    [authState, login, logout],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}
