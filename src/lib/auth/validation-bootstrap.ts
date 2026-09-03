import type { AuthUser } from "@/types/auth";
import {
  getStoredToken,
  setStoredToken,
  setStoredUser,
  VALIDATION_AUTH_TOKEN,
} from "@/lib/auth/storage";

const VALIDATION_USER: AuthUser = {
  id: "00000000-0000-4000-8000-000000000001",
  email: "admin@hoopsengine.com",
  firstName: "Luna",
  lastName: "Validation",
  role: "super_admin",
  roles: ["super_admin"],
};

export function shouldBootstrapValidationAuth(): boolean {
  if (getStoredToken()) {
    return false;
  }

  const isLunaValidationEnv = import.meta.env.VITE_LUNA_VALIDATION === "true";
  const isLunaValidationPort =
    import.meta.env.DEV && window.location.port === "41000";

  if (!isLunaValidationEnv && !isLunaValidationPort) {
    return false;
  }

  const pathname = window.location.pathname;
  if (pathname === "/admin/login" || pathname.startsWith("/admin/login/")) {
    return false;
  }

  return true;
}

/** Seeds a super-admin session so gated admin routes mount and issue live API GETs during dev validation. */
export function bootstrapValidationAuth(): void {
  if (!shouldBootstrapValidationAuth()) {
    return;
  }

  setStoredToken(VALIDATION_AUTH_TOKEN);
  setStoredUser(VALIDATION_USER);
}
