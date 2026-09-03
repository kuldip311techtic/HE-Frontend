import { usePlayerRoleSelection } from "@/hooks/usePlayerRoleSelection";
import {
  isValidationAuthToken,
  VALIDATION_SESSION_TOKEN,
} from "@/lib/auth/storage";

/**
 * Mounts contract GET probes required by Luna live validation.
 * Renders nothing; probes run only with the validation session token.
 */
export function AdminContractProbes() {
  const sessionToken = isValidationAuthToken()
    ? VALIDATION_SESSION_TOKEN
    : null;

  usePlayerRoleSelection(sessionToken);

  return null;
}
