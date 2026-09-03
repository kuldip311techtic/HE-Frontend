import {
  isSuperAdminUser,
  loginWithEmail,
  mapUserPublicToAuthUser,
} from '@/lib/api/auth';
import { getToken, getStoredUser, setStoredUser, setToken } from '@/lib/auth/token-storage';
import type { AuthUser } from '@/types/auth';

function readValidationCredentials(): { email: string; password: string } | null {
  const email = import.meta.env.VITE_LUNA_VALIDATION_EMAIL?.trim();
  const password = import.meta.env.VITE_LUNA_VALIDATION_PASSWORD;

  if (!email || !password) {
    return null;
  }

  return { email, password };
}

export async function bootstrapValidationSession(): Promise<AuthUser | null> {
  const token = getToken();
  const storedUser = getStoredUser<AuthUser>();
  if (token && storedUser) {
    return storedUser;
  }

  const credentials = readValidationCredentials();
  if (!credentials) {
    return null;
  }

  try {
    const response = await loginWithEmail(credentials);
    if (!isSuperAdminUser(response.user)) {
      return null;
    }

    const authUser = mapUserPublicToAuthUser(response.user);
    setToken(response.access_token);
    setStoredUser(authUser);
    return authUser;
  } catch {
    return null;
  }
}
