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
  bootstrapValidationSession,
  hydrateAuthUserFromToken,
  shouldInitializeAuthSession,
} from "@/lib/auth/bootstrapSession";
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

function readStoredAuthState(): AuthState {
  const token = getStoredToken();
  const user = getStoredUser<AuthUser>();

  return {
    user,
    token,
    isLoading: false,
    isAuthenticated: Boolean(token && user),
  };
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>(() => {
    const stored = readStoredAuthState();
    if (stored.isAuthenticated) return stored;

    return {
      user: null,
      token: getStoredToken(),
      isLoading: shouldInitializeAuthSession(),
      isAuthenticated: false,
    };
  });

  useEffect(() => {
    if (!state.isLoading) return;

    let cancelled = false;

    const initializeSession = async () => {
      const stored = readStoredAuthState();
      if (stored.isAuthenticated) {
        if (!cancelled) setState(stored);
        return;
      }

      const token = getStoredToken();
      if (token) {
        const hydratedUser = await hydrateAuthUserFromToken();
        if (cancelled) return;
        if (hydratedUser) {
          setState({
            user: hydratedUser,
            token,
            isLoading: false,
            isAuthenticated: true,
          });
          return;
        }
      }

      const validationSession = await bootstrapValidationSession();
      if (cancelled) return;
      if (validationSession) {
        setState({
          user: validationSession.user,
          token: validationSession.token,
          isLoading: false,
          isAuthenticated: true,
        });
        return;
      }

      setState({
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
      });
    };

    void initializeSession();

    return () => {
      cancelled = true;
    };
  }, [state.isLoading]);

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
