import type { AdminRole } from "@/types/api";

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  email: string;
  role: string;
  redirectTo: string;
}

const SESSION_KEY = "admin.session";

export const ADMIN_ROLES: readonly AdminRole[] = ["admin", "super_admin"];

export function isAdminRole(role: string): role is AdminRole {
  return role === "admin" || role === "super_admin";
}

export function readSession(): AuthSession | null {
  const raw = window.localStorage.getItem(SESSION_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isAuthSession(parsed)) {
      window.localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return parsed;
  } catch {
    window.localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function writeSession(session: AuthSession): void {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  window.localStorage.removeItem(SESSION_KEY);
}

export function getAccessToken(): string | null {
  return readSession()?.accessToken ?? null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isAuthSession(value: unknown): value is AuthSession {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.accessToken === "string" &&
    value.accessToken.length > 0 &&
    typeof value.refreshToken === "string" &&
    typeof value.tokenType === "string" &&
    typeof value.expiresIn === "number" &&
    typeof value.email === "string" &&
    typeof value.role === "string" &&
    value.role.length > 0 &&
    typeof value.redirectTo === "string"
  );
}
