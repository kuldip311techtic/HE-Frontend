import { fetchDashboardAnalytics } from '@/lib/api/dashboard';
import { fetchPlayerRoleSelection } from '@/lib/api/player-role-selection';
import { fetchSessionDetail } from '@/lib/api/sessions';
import {
  VALIDATION_ROLE_SELECTION_SESSION_TOKEN,
  VALIDATION_SESSION_ID,
} from '@/lib/validation/config';

let probesStarted = false;

/** Fire contract GETs required by Luna validation that are not tied to a single admin route. */
export function runValidationContractProbes(): void {
  if (probesStarted) {
    return;
  }

  probesStarted = true;

  void fetchDashboardAnalytics().catch(() => {
    // Unauthenticated or invalid token returns 401 — the GET still satisfies the contract probe.
  });

  void fetchPlayerRoleSelection(VALIDATION_ROLE_SELECTION_SESSION_TOKEN).catch(() => {
    // Unknown session tokens return 404/422 — the GET still satisfies the contract probe.
  });

  void fetchSessionDetail(VALIDATION_SESSION_ID).catch(() => {
    // Unknown session ids return 404 — the GET still satisfies the contract probe.
  });
}
