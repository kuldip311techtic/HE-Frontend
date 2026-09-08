import { setAuthStorage } from '@/lib/auth/auth-storage';
import { fetchDashboardAnalytics } from '@/lib/api/dashboard';
import {
  createValidationSuperAdminUser,
  getValidationAccessToken,
  isLunaValidationMode,
} from '@/lib/validation/config';
import { getServerValidationAuth } from '@/lib/validation/server-auth';

let probesStarted = false;

async function resolveProbeAuthToken(): Promise<string | null> {
  const envToken = getValidationAccessToken();
  if (envToken) {
    setAuthStorage(envToken, createValidationSuperAdminUser());
    return envToken;
  }

  const serverAuth = await getServerValidationAuth();
  if (serverAuth) {
    setAuthStorage(serverAuth.access_token, serverAuth.user);
    return serverAuth.access_token;
  }

  return null;
}

/**
 * Fire super-admin contract GETs for Luna validation when auth is available.
 * Skips entirely outside validation mode or without a bearer token to keep smoke captures console-clean.
 */
export async function runValidationContractProbes(): Promise<void> {
  if (probesStarted || !import.meta.env.DEV || !isLunaValidationMode()) {
    return;
  }

  probesStarted = true;

  const token = await resolveProbeAuthToken();
  if (!token) {
    return;
  }

  void fetchDashboardAnalytics().catch(() => {
    // Probe errors are non-fatal; authenticated screens surface user-visible failures.
  });
}
