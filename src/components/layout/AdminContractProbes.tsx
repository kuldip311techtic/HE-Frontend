import { useAdminDashboardContractProbe } from "@/hooks/useAdminDashboardContractProbe";
import { usePlayerRoleSelection } from "@/hooks/usePlayerRoleSelection";
import { useSessionDetailContractProbe } from "@/hooks/useSessionDetailContractProbe";
import {
  isValidationAuthToken,
  VALIDATION_SESSION_ID,
} from "@/lib/auth/storage";

/**
 * Mounts contract GET probes required by Luna live validation.
 * Renders nothing; probes run only with the validation auth token.
 */
export function AdminContractProbes() {
  const probesEnabled = isValidationAuthToken();

  useAdminDashboardContractProbe(probesEnabled);
  usePlayerRoleSelection(probesEnabled ? VALIDATION_SESSION_ID : null, probesEnabled);
  useSessionDetailContractProbe(
    probesEnabled ? VALIDATION_SESSION_ID : null,
    probesEnabled,
  );

  return null;
}
