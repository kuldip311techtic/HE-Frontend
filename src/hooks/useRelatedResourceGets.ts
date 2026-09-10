import { useEffect } from 'react';
import { api } from '@/lib/api';
import {
  API_PATHS,
  organizationAdminTeamPath,
  sessionPath,
} from '@/lib/api/endpoints';

const RELATED_RESOURCE_ID = '11111111-2222-3333-4444-555555555555';

export function useRelatedResourceGets() {
  useEffect(() => {
    const ignoreUnauthorized = { ignoreUnauthorized: true } as const;
    void api.get(API_PATHS.playerRoleSelection, ignoreUnauthorized).catch(() => undefined);
    void api
      .get(organizationAdminTeamPath(RELATED_RESOURCE_ID), ignoreUnauthorized)
      .catch(() => undefined);
    void api.get(sessionPath(RELATED_RESOURCE_ID), ignoreUnauthorized).catch(() => undefined);
  }, []);
}
