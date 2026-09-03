import type { PlayerRoleSelectionResponse } from '@/types/player-role-selection';
import { apiClient } from './client';
import { CONTRACT_ROUTES, contractPathToClientPath } from './endpoints';

const { method, path: contractPath } = CONTRACT_ROUTES.playerRoleSelection;

/** GET /api/v1/player/role-selection — public; requires session_token query param */
export async function fetchPlayerRoleSelection(
  sessionToken: string,
): Promise<PlayerRoleSelectionResponse> {
  const { data } = await apiClient.request<PlayerRoleSelectionResponse>({
    method,
    url: contractPathToClientPath(contractPath),
    params: { session_token: sessionToken },
  });
  return data;
}
