import * as React from 'react';
import { setToken, setStoredUser, getStoredUser, getToken, clearAuthStorage } from '@/lib/auth/storage';
import { canAccessAdmin } from '@/lib/auth/roles';
import type { AuthLoginResponse, AuthUser } from '@/types/auth';

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (response: AuthLoginResponse) => void;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

const DEV_BYPASS = import.meta.env.VITE_DEV_ADMIN_BYPASS === 'true';

const DEV_USER: AuthUser = {
  id: '00000000-0000-4000-8000-000000000001',
  email: 'admin.hoopsengine@yopmail.com',
  role: 'super_admin',
  org_id: null,
  first_name: 'Super',
  last_name: 'Admin',
  is_super_admin: true,
  is_active: true,
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [token, setTokenState] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (DEV_BYPASS) {
      setUser(DEV_USER);
      setTokenState('dev-bypass-token');
      setIsLoading(false);
      return;
    }

    const storedToken = getToken();
    const storedUser = getStoredUser();
    if (storedToken && storedUser) {
      setTokenState(storedToken);
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  React.useEffect(() => {
    const handleLogout = () => {
      setUser(null);
      setTokenState(null);
    };
    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, []);

  const login = React.useCallback((response: AuthLoginResponse) => {
    setToken(response.access_token);
    setStoredUser(response.user);
    setTokenState(response.access_token);
    setUser(response.user);
  }, []);

  const logout = React.useCallback(() => {
    clearAuthStorage();
    setUser(null);
    setTokenState(null);
  }, []);

  const value: AuthContextValue = {
    user,
    token,
    isLoading,
    isAuthenticated: Boolean(token && user),
    isAdmin: canAccessAdmin(user),
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
}
