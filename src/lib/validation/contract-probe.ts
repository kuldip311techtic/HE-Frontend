import { fetchDashboardAnalytics } from '@/lib/api/dashboard';
import { getAuthToken, setAuthStorage } from '@/lib/auth/auth-storage';
import {
  createValidationSuperAdminUser,
  getValidationAccessToken,
  getValidationLoginCredentials,
  isLunaValidationMode,
  isPublicAdminRoute,
} from '@/lib/validation/config';
import { waitForServerValidationAuth } from '@/lib/validation/server-auth';

let probesStarted = false;

async function ensureValidationAuthForProbe(): Promise<boolean> {
  if (getAuthToken()) {
    return true;
  }

  const envToken = getValidationAccessToken();
  if (envToken) {
    setAuthStorage(envToken, createValidationSuperAdminUser());
    return true;
  }

  const serverAuth = await waitForServerValidationAuth(3, 200);
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

/**
 * Fire Super Admin contract GETs for Luna validation on dev bootstrap.
 * Skips public routes and only runs when validation credentials are configured.
 */
export function runValidationContractProbes(): void {
  if (!import.meta.env.DEV || !isLunaValidationMode()) {
    return;
  }

  if (isPublicAdminRoute()) {
    return;
  }

  if (probesStarted) {
    return;
  }

  probesStarted = true;

  void (async () => {
    const hasAuth = await ensureValidationAuthForProbe();
    if (!hasAuth) {
      return;
    }

    void fetchDashboardAnalytics().catch(() => {
      // Probe errors are swallowed — screens surface user-visible failures.
    });
  })();
}
