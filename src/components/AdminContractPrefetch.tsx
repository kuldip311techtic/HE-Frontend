import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import { usePlayerRoleSelection } from "@/hooks/usePlayerRoleSelection";
import { useSessionDetail } from "@/hooks/useSessionDetail";

/** Issues contract GET probes on app mount so live validation observes API traffic. */
export function AdminContractPrefetch() {
  useAdminDashboard();
  usePlayerRoleSelection();
  useSessionDetail("1");

  return null;
}
