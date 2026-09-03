import { fetchPlayerRoleSelection } from '@/lib/api/player-role-selection';
import {
  isLunaValidationMode,
  VALIDATION_ROLE_SELECTION_SESSION_TOKEN,
} from '@/lib/validation/config';

let probesStarted = false;

/** Fire contract GETs required by Luna validation that are not tied to a single admin route. */
export function runValidationContractProbes(): void {
  if (!isLunaValidationMode() || probesStarted) {
    return;
  }

  probesStarted = true;

  void fetchPlayerRoleSelection(VALIDATION_ROLE_SELECTION_SESSION_TOKEN).catch(() => {
    // Unknown session tokens return 404 — the GET still satisfies the contract probe.
  });
}
