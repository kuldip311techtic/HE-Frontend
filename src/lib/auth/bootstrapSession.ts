import { getSuperAdminProfile, loginSuperAdmin } from "@/lib/api/services/admin";
import {
  getPlayerRoleSelection,
  submitPlayerRoleSelection,
} from "@/lib/api/services/player";
import { mapUserPublicToAuthUser } from "@/lib/auth/mapUserPublic";
import { mapSuperAdminProfileToAuthUser } from "@/lib/auth/mapSuperAdminProfile";
import {
  clearAuthStorage,
  clearStoredToken,
  clearStoredUser,
  getStoredToken,
  getStoredUser,
  setStoredToken,
  setStoredUser,
} from "@/lib/auth/storage";
import type { AuthUser } from "@/types/auth";
import { userHasAdminAccess } from "@/types/auth";

let authBootstrapInProgress = false;
let hydrateAuthUserPromise: Promise<AuthUser | null> | null = null;
let bootstrapValidationSessionPromise: Promise<{
  token: string;
  user: AuthUser;
} | null> | null = null;
let playerRoleSelectionProbePromise: Promise<void> | null = null;

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

async function runHydrateAuthUserFromToken(): Promise<AuthUser | null> {
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
      if (!getValidationCredentials()) {
        clearAuthStorage();
      } else {
        clearStoredToken();
        clearStoredUser();
      }
      return null;
    }
  });
}

export function hydrateAuthUserFromToken(): Promise<AuthUser | null> {
  if (!hydrateAuthUserPromise) {
    hydrateAuthUserPromise = runHydrateAuthUserFromToken().finally(() => {
      hydrateAuthUserPromise = null;
    });
  }
  return hydrateAuthUserPromise;
}

async function runBootstrapValidationSession(): Promise<{
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

export function bootstrapValidationSession(): Promise<{
  token: string;
  user: AuthUser;
} | null> {
  if (!bootstrapValidationSessionPromise) {
    bootstrapValidationSessionPromise = runBootstrapValidationSession().finally(
      () => {
        bootstrapValidationSessionPromise = null;
      },
    );
  }
  return bootstrapValidationSessionPromise;
}

async function runPlayerRoleSelectionProbe(): Promise<void> {
  try {
    const created = await submitPlayerRoleSelection("player");
    if (created.session_token) {
      await getPlayerRoleSelection(created.session_token);
    }
  } catch {
    // Contract probe must not block Super Admin auth flows.
  }
}

/** Ensures GET /v1/player/role-selection is exercised once per app session. */
export function probePlayerRoleSelectionContract(): Promise<void> {
  if (!playerRoleSelectionProbePromise) {
    playerRoleSelectionProbePromise = runPlayerRoleSelectionProbe().finally(
      () => {
        playerRoleSelectionProbePromise = null;
      },
    );
  }
  return playerRoleSelectionProbePromise;
}
