import { describe, expect, it, vi } from 'vitest';

import {
  fetchPlayerRoleSelection,
  PLAYER_ROLE_SELECTION_PROBE_TOKEN,
} from '@/lib/api/player-role-selection';
import { apiClient } from '@/lib/api/client';

describe('player role selection API', () => {
  it('calls GET /v1/player/role-selection with session_token query param', async () => {
    const getSpy = vi.spyOn(apiClient, 'get').mockResolvedValue({
      data: {
        success: true,
        message: 'Role selection loaded',
        status: 'ready',
        title: 'Select Your Role',
        session_token: PLAYER_ROLE_SELECTION_PROBE_TOKEN,
        selected_role: 'coach',
        role: 'coach',
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: { headers: {} },
    });

    await fetchPlayerRoleSelection({ session_token: PLAYER_ROLE_SELECTION_PROBE_TOKEN });

    expect(getSpy).toHaveBeenCalledWith('/v1/player/role-selection', {
      params: { session_token: PLAYER_ROLE_SELECTION_PROBE_TOKEN },
    });

    getSpy.mockRestore();
  });
});
