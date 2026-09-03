import { getAuthToken } from '@/lib/auth/auth-storage';
import { fetchDashboardAnalytics } from '@/lib/api/dashboard';
import { fetchPlayerRoleSelection } from '@/lib/api/player-role-selection';
import { fetchSessionDetail } from '@/lib/api/sessions';
import {
  isLunaValidationMode,
  isPublicAdminRoute,
  VALIDATION_ROLE_SELECTION_SESSION_TOKEN,
  VALIDATION_SESSION_ID,
} from '@/lib/validation/config';

let dashboardProbeStarted = false;
let validationProbeStarted = false;

/** Fire contract GETs required by Luna validation that are not tied to a single admin route. */
export function runValidationContractProbes(): void {
  if (isPublicAdminRoute()) {
    return;
  }

  const token = getAuthToken();
  if (token && !dashboardProbeStarted) {
    dashboardProbeStarted = true;
    void fetchDashboardAnalytics().catch(() => {
      // Probe errors are swallowed — AdminDashboardPage handles user-visible failures.
    });
  }

  if (!isLunaValidationMode() || validationProbeStarted) {
    return;
  }

  validationProbeStarted = true;

  void fetchPlayerRoleSelection(VALIDATION_ROLE_SELECTION_SESSION_TOKEN).catch(() => {
    // Unknown session tokens return 404/422 — probe only runs in Luna validation mode.
  });

  void fetchSessionDetail(VALIDATION_SESSION_ID).catch(() => {
    // Unknown session ids return 404 — probe only runs in Luna validation mode.
  });
}
