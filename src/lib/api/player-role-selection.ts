import { apiClient } from '@/lib/api/client';
import type {
  PlayerRoleSelectionCurrentResponse,
  PlayerRoleSelectionParams,
} from '@/types/api';

/** OpenAPI example token used when no persisted onboarding session exists. */
export const PLAYER_ROLE_SELECTION_PROBE_TOKEN = '11111111-2222-3333-4444-555555555555';

export async function fetchPlayerRoleSelection(
  params: PlayerRoleSelectionParams,
): Promise<PlayerRoleSelectionCurrentResponse> {
  const { data } = await apiClient.get<PlayerRoleSelectionCurrentResponse>(
    '/v1/player/role-selection',
    { params },
  );
  return data;
}
