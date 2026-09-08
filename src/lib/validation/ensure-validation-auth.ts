import { getAuthToken, setAuthStorage } from '@/lib/auth/auth-storage';
import {
  createValidationSuperAdminUser,
  getValidationAccessToken,
  getValidationLoginCredentials,
} from '@/lib/validation/config';
import { waitForServerValidationAuth } from '@/lib/validation/server-auth';

/** Resolve a Super Admin JWT for Luna dev/validation captures. */
export async function ensureValidationAuth(): Promise<boolean> {
  if (getAuthToken()) {
    return true;
  }

  const envToken = getValidationAccessToken();
  if (envToken) {
    setAuthStorage(envToken, createValidationSuperAdminUser());
    return true;
  }

  const serverAuth = await waitForServerValidationAuth(30, 500);
  if (serverAuth) {
    setAuthStorage(serverAuth.access_token, serverAuth.user);
    return true;
  }

  const credentials = getValidationLoginCredentials();
  if (!credentials) {
    return false;
  }

  try {
    const { login: loginApi } = await import('@/lib/api/auth');
    const response = await loginApi(credentials);
    setAuthStorage(response.access_token, response.user);
    return true;
  } catch {
    return false;
  }
}
