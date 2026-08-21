import { createContext } from "react";

import type { AuthSession } from "@/lib/auth/session";
import type { LoginRequest } from "@/types/api";

export interface AuthContextValue {
  session: AuthSession | null;
  status: "loading" | "ready";
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isLoggingIn: boolean;
  loginError: string | null;
  login: (credentials: LoginRequest) => Promise<AuthSession>;
  logout: () => void;
  clearLoginError: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
