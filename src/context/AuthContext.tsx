import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { login as loginRequest } from "@/lib/api/endpoints";
import { ApiError } from "@/lib/apiClient";
import {
  clearSession,
  isAdminRole,
  readSession,
  writeSession,
  type AuthSession,
} from "@/lib/auth/session";
import { AuthContext, type AuthContextValue } from "@/context/auth-context";
import type { LoginRequest } from "@/types/api";

function readInitialSession(): AuthSession | null {
  if (typeof window === "undefined") {
    return null;
  }
  return readSession();
}

function resolveAdminRedirect(path: string): string {
  if (
    path.startsWith("/admin") &&
    !path.startsWith("//") &&
    !path.includes("\\")
  ) {
    return path;
  }
  return "/admin/dashboard";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(
    readInitialSession,
  );
  const [status] = useState<"loading" | "ready">("ready");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const login = useCallback(async (credentials: LoginRequest) => {
    setIsLoggingIn(true);
    setLoginError(null);

    try {
      const response = await loginRequest(credentials);
      if (!response.success || !response.data.access_token) {
        throw new ApiError(response.message || "Sign in failed", 401);
      }

      if (!response.data.subscription.has_access) {
        throw new ApiError(
          "Admin access is not available for this account.",
          403,
        );
      }

      const nextSession: AuthSession = {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        tokenType: response.data.token_type,
        expiresIn: response.data.expires_in,
        email: response.data.email,
        role: "super_admin",
        redirectTo: resolveAdminRedirect(response.data.redirect_to),
      };

      writeSession(nextSession);
      setSession(nextSession);
      return nextSession;
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "Unable to sign in. Try again.";
      setLoginError(message);
      throw error;
    } finally {
      setIsLoggingIn(false);
    }
  }, []);

  useEffect(() => {
    function onSessionCleared() {
      setSession(null);
    }

    window.addEventListener("admin:session-cleared", onSessionCleared);
    return () => {
      window.removeEventListener("admin:session-cleared", onSessionCleared);
    };
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setSession(null);
    setLoginError(null);
  }, []);

  const clearLoginError = useCallback(() => {
    setLoginError(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      status,
      isAuthenticated: session !== null,
      isAdmin: session ? isAdminRole(session.role) : false,
      isSuperAdmin: session?.role === "super_admin",
      isLoggingIn,
      loginError,
      login,
      logout,
      clearLoginError,
    }),
    [session, status, isLoggingIn, loginError, login, logout, clearLoginError],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
