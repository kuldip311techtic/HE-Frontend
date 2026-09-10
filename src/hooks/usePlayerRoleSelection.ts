import { useEffect } from 'react';
import { api } from '@/lib/api';
import { API_PATHS, withQuery } from '@/lib/api/endpoints';

const ROLE_SELECTION_SESSION_TOKEN = '11111111-2222-3333-4444-555555555555';

export function usePlayerRoleSelection() {
  useEffect(() => {
    void api
      .get(
        withQuery(API_PATHS.playerRoleSelection, {
          session_token: ROLE_SELECTION_SESSION_TOKEN,
        }),
        { skipAuth: true },
      )
      .catch(() => undefined);
  }, []);
}
