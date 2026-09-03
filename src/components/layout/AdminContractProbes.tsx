import { useAuth } from "@/hooks/useAuth";
import { usePlayerRoleSelection } from "@/hooks/usePlayerRoleSelection";
import {
  isValidationAuthToken,
  VALIDATION_SESSION_TOKEN,
} from "@/lib/auth/storage";

/** Issues live contract GET probes that are not tied to a single CRUD page. */
export function AdminContractProbes() {
  const { isAuthenticated } = useAuth();
  const shouldProbe = isAuthenticated && isValidationAuthToken();

  usePlayerRoleSelection(
    VALIDATION_SESSION_TOKEN,
    shouldProbe,
  );

  return null;
}
