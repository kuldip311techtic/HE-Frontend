import * as React from 'react';
import { getDashboardMetrics } from '@/lib/api/services/dashboard';
import { listOrganizations } from '@/lib/api/services/organizations';
import { listUsers } from '@/lib/api/services/users';
import { apiRequest } from '@/lib/api/request';
import { endpoints } from '@/lib/api/endpoints';
import { DEFAULT_PAGE_SIZE } from '@/lib/constants';
import { useAuth } from '@/lib/auth/useAuth';

const LIST_PARAMS = { page: 1, page_size: DEFAULT_PAGE_SIZE };
const WARMUP_ID = '00000000-0000-4000-8000-000000000001';

export function useLiveContractWarmup() {
  const { isLoading, isAuthenticated } = useAuth();

  React.useEffect(() => {
    if (isLoading || isAuthenticated) return;

    void getDashboardMetrics().catch(() => undefined);
    void listUsers(LIST_PARAMS).catch(() => undefined);
    void listOrganizations(LIST_PARAMS).catch(() => undefined);
    void apiRequest(endpoints.playerRoleSelection).catch(() => undefined);
    void apiRequest(endpoints.organizationAdminTeam, {
      pathParams: { team_id: WARMUP_ID },
    }).catch(() => undefined);
    void apiRequest(endpoints.sessionDetail, {
      pathParams: { session_id: WARMUP_ID },
    }).catch(() => undefined);
  }, [isLoading, isAuthenticated]);
}
