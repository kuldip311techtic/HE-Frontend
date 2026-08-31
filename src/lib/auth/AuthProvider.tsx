import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { setAuthTokenGetter } from '@/lib/api/client';
import {
  AUTH_STORAGE_KEY,
  type AuthState,
  type AuthUser,
  type LoginCredentials,
  type StoredAuth,
} from '@/types/auth';
import { hasAdminAccess } from '@/lib/utils';

interface AuthContextValue extends AuthState {
  isLoading: boolean;
  isAdmin: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function readStoredAuth(): StoredAuth | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw) as StoredAuth;
  } catch {
    return null;
  }
}

function persistAuth(stored: StoredAuth | null): void {
  if (stored) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(stored));
  } else {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = readStoredAuth();
    if (stored) {
      setToken(stored.token);
      setUser(stored.user);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    setAuthTokenGetter(() => token);
  }, [token]);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ?? 'http://localhost:3033'}/api/super-admin/login`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      },
    );

    if (!response.ok) {
      let message = 'Login failed';
      try {
        const payload = (await response.json()) as { detail?: string };
        if (payload.detail) {
          message = payload.detail;
        }
      } catch {
        // use default message
      }
      throw new Error(message);
    }

    const data = (await response.json()) as {
      access_token?: string;
      token?: string;
      user?: AuthUser;
    };

    const authToken = data.access_token ?? data.token;
    if (!authToken) {
      throw new Error('No authentication token received');
    }

    const authUser: AuthUser = data.user ?? {
      id: 'local-user',
      email: credentials.email,
      name: credentials.email.split('@')[0] ?? 'Admin User',
      role: 'super_admin',
      roles: ['super_admin'],
    };

    const stored: StoredAuth = { token: authToken, user: authUser };
    persistAuth(stored);
    setToken(authToken);
    setUser(authUser);
  }, []);

  const logout = useCallback(() => {
    persistAuth(null);
    setToken(null);
    setUser(null);
  }, []);

  const isAdmin = useMemo(() => {
    if (!user) {
      return false;
    }
    const roles = user.roles.length > 0 ? user.roles : [user.role];
    return hasAdminAccess(roles);
  }, [user]);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token && user),
      isLoading,
      isAdmin,
      login,
      logout,
    }),
    [token, user, isLoading, isAdmin, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
