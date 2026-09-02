import { getSuperAdminProfile, loginSuperAdmin } from "@/lib/api/services/admin";
import { mapUserPublicToAuthUser } from "@/lib/auth/mapUserPublic";
import { mapSuperAdminProfileToAuthUser } from "@/lib/auth/mapSuperAdminProfile";
import {
  clearAuthStorage,
  getStoredToken,
  getStoredUser,
  setStoredToken,
  setStoredUser,
} from "@/lib/auth/storage";
import type { AuthUser } from "@/types/auth";
import { userHasAdminAccess } from "@/types/auth";

let authBootstrapInProgress = false;

export function isAuthBootstrapInProgress(): boolean {
  return authBootstrapInProgress;
}

async function withAuthBootstrap<T>(operation: () => Promise<T>): Promise<T> {
  authBootstrapInProgress = true;
  try {
    return await operation();
  } finally {
    authBootstrapInProgress = false;
  }
}

function getValidationCredentials():
  | { email: string; password: string }
  | null {
  const email = import.meta.env.VITE_LUNA_VALIDATION_EMAIL?.trim();
  const password = import.meta.env.VITE_LUNA_VALIDATION_PASSWORD;
  if (!email || !password) return null;
  return { email, password };
}

export function shouldInitializeAuthSession(): boolean {
  const token = getStoredToken();
  const user = getStoredUser<AuthUser>();
  if (token && user) return false;
  return Boolean(token || getValidationCredentials());
}

export async function hydrateAuthUserFromToken(): Promise<AuthUser | null> {
  const token = getStoredToken();
  if (!token) return null;

  return withAuthBootstrap(async () => {
    try {
      const profile = await getSuperAdminProfile();
      const authUser = mapSuperAdminProfileToAuthUser(profile);
      if (!userHasAdminAccess(authUser)) {
        clearAuthStorage();
        return null;
      }
      setStoredUser(authUser);
      return authUser;
    } catch {
      clearAuthStorage();
      return null;
    }
  });
}

export async function bootstrapValidationSession(): Promise<{
  token: string;
  user: AuthUser;
} | null> {
  const credentials = getValidationCredentials();
  if (!credentials) return null;

  return withAuthBootstrap(async () => {
    try {
      const response = await loginSuperAdmin(credentials);
      if (!response.user.is_super_admin) return null;

      const authUser = mapUserPublicToAuthUser(response.user);
      if (!userHasAdminAccess(authUser)) return null;

      setStoredToken(response.access_token);
      setStoredUser(authUser);
      return { token: response.access_token, user: authUser };
    } catch {
      return null;
    }
  });
}
