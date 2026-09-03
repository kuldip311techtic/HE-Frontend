import { usePlayerRoleSelectionContract } from '@/hooks/usePlayerRoleSelection';

/** Fires GET /v1/player/role-selection on app load for contract validation. */
export function PlayerRoleSelectionBootstrap() {
  usePlayerRoleSelectionContract();
  return null;
}
