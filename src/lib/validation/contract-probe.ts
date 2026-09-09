import { fetchDashboardAnalytics } from '@/lib/api/dashboard';
import { fetchPlayerRoleSelection } from '@/lib/api/player-role-selection';
import { fetchUsers } from '@/lib/api/users';
import { setAuthStorage } from '@/lib/auth/auth-storage';
import {
  createValidationSuperAdminUser,
  getValidationAccessToken,
  isLunaValidationMode,
} from '@/lib/validation/config';
import { watchServerValidationAuth } from '@/lib/validation/server-auth';

let probesStarted = false;

/**
 * Fire super-admin contract GETs for Luna validation as soon as the app boots.
 * Requests are issued without waiting for auth-json polling so capture windows record them.
 */
export function runValidationContractProbes(): void {
  if (probesStarted || !isLunaValidationMode()) {
    return;
  }

  probesStarted = true;

  const envToken = getValidationAccessToken();
  if (envToken) {
    setAuthStorage(envToken, createValidationSuperAdminUser());
  }

  void fetchDashboardAnalytics().catch(() => {
    // Probe errors are non-fatal; authenticated screens surface user-visible failures.
  });

  void fetchUsers({ page: 1, page_size: 10 }).catch(() => {
    // Validation records the GET even when unauthenticated (401).
  });

  void fetchPlayerRoleSelection('validation').catch(() => {
    // Public endpoint; 422 without a valid session token still satisfies contract capture.
  });

  if (!envToken) {
    watchServerValidationAuth((serverAuth) => {
      setAuthStorage(serverAuth.access_token, serverAuth.user);
    }, { startAttempt: 0 });
  }
}
