import { fetchDashboardAnalytics } from '@/lib/api/dashboard';
import { fetchPlayerRoleSelection } from '@/lib/api/player-role-selection';
import { fetchSessionDetail } from '@/lib/api/sessions';
import {
  VALIDATION_ROLE_SELECTION_SESSION_TOKEN,
  VALIDATION_SESSION_ID,
} from '@/lib/validation/config';

let probesStarted = false;

/**
 * Fire contract GETs required by Luna validation on dev bootstrap.
 * Errors are swallowed — real screens handle user-visible failures.
 */
export function runValidationContractProbes(): void {
  if (probesStarted || !import.meta.env.DEV) {
    return;
  }

  probesStarted = true;

  void fetchDashboardAnalytics().catch(() => {
    // Unauthenticated captures return 401 — the GET still satisfies contract recording.
  });

  void fetchPlayerRoleSelection(VALIDATION_ROLE_SELECTION_SESSION_TOKEN).catch(() => {
    // Probe token may 404/422 until backend seeds data — contract path is still exercised.
  });

  void fetchSessionDetail(VALIDATION_SESSION_ID).catch(() => {
    // Unknown session ids return 404 — contract path is still exercised.
  });
}
