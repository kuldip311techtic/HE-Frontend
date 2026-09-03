import { useQuery } from '@tanstack/react-query';

import {
  fetchPlayerRoleSelection,
  PLAYER_ROLE_SELECTION_PROBE_TOKEN,
} from '@/lib/api/player-role-selection';
import { queryKeys } from '@/lib/api/query-keys';

function readRoleSelectionSessionToken(): string {
  const fromEnv = import.meta.env.VITE_LUNA_ROLE_SELECTION_SESSION_TOKEN?.trim();
  return fromEnv || PLAYER_ROLE_SELECTION_PROBE_TOKEN;
}

/**
 * Loads the public player role-selection contract GET once on app boot so Luna
 * validation can observe GET /api/v1/player/role-selection against the live backend.
 */
export function usePlayerRoleSelectionContract() {
  const sessionToken = readRoleSelectionSessionToken();

  return useQuery({
    queryKey: queryKeys.player.roleSelection(sessionToken),
    queryFn: () => fetchPlayerRoleSelection({ session_token: sessionToken }),
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}
