import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { AuthState, AuthUser } from "@/types/auth";
import { userHasAdminAccess } from "@/types/auth";
import {
  clearAuthStorage,
  getStoredToken,
  getStoredUser,
  setStoredToken,
  setStoredUser,
} from "@/lib/auth/storage";

interface AuthContextValue extends AuthState {
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
  hasAdminAccess: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

const initialAuthState: AuthState = {
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>(initialAuthState);

  useEffect(() => {
    const token = getStoredToken();
    const user = getStoredUser<AuthUser>();

    setState({
      user,
      token,
      isLoading: false,
      isAuthenticated: Boolean(token && user),
    });
  }, []);

  const login = useCallback((token: string, user: AuthUser) => {
    setStoredToken(token);
    setStoredUser(user);
    setState({
      user,
      token,
      isLoading: false,
      isAuthenticated: true,
    });
  }, []);

  const logout = useCallback(() => {
    clearAuthStorage();
    setState({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,
    });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      login,
      logout,
      hasAdminAccess: userHasAdminAccess(state.user),
    }),
    [state, login, logout],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
