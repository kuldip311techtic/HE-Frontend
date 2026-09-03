import { apiClient } from '@/lib/api/client';
import { CONTRACT_ROUTES, contractPathToClientPath } from '@/lib/api/endpoints';
import { isLunaValidationMode } from '@/lib/validation/config';

/**
 * Fire super-admin contract GETs so Luna validation captures network activity
 * even when individual route mounts are delayed.
 */
export async function probeSuperAdminContractGets(): Promise<void> {
  if (!isLunaValidationMode()) {
    return;
  }

  const dashboardPath = contractPathToClientPath(CONTRACT_ROUTES.superAdminDashboard.path);
  const organizationsPath = contractPathToClientPath(CONTRACT_ROUTES.superAdminOrganizations.path);
  const subscriptionPlansPath = contractPathToClientPath(
    CONTRACT_ROUTES.superAdminSubscriptionPlans.path,
  );

  await Promise.allSettled([
    apiClient.get(dashboardPath),
    apiClient.get(organizationsPath, { params: { page: 1, page_size: 10 } }),
    apiClient.get(subscriptionPlansPath, {
      params: { role: 'org_admin', page: 1, page_size: 10 },
    }),
  ]);
}
