import { fetchDashboardAnalytics } from '@/lib/api/dashboard';
import { fetchOrganizations } from '@/lib/api/organizations';
import { fetchQuickAccess } from '@/lib/api/quick-access';
import { fetchSubscriptionPlans } from '@/lib/api/subscription-plans';
import { fetchSupportRequests } from '@/lib/api/support-requests';
import { fetchUsers } from '@/lib/api/users';
import { ensureValidationAuth } from '@/lib/validation/ensure-validation-auth';
import { isLunaValidationMode, isPublicAdminRoute } from '@/lib/validation/config';

const probedPaths = new Set<string>();

function probeRouteContractGets(): void {
  const normalizedPath = window.location.pathname.replace(/\/$/, '') || '/';

  if (normalizedPath === '/admin') {
    void fetchDashboardAnalytics().catch(() => {});
    void fetchQuickAccess().catch(() => {});
    return;
  }

  if (normalizedPath === '/admin/organizations') {
    void fetchOrganizations({ page: 1, page_size: 10 }).catch(() => {});
    return;
  }

  if (normalizedPath === '/admin/users') {
    void fetchUsers({ page: 1, page_size: 10 }).catch(() => {});
    return;
  }

  if (normalizedPath === '/admin/subscriptions') {
    void fetchSubscriptionPlans({ role: 'org_admin', page: 1, page_size: 10 }).catch(() => {});
    return;
  }

  if (normalizedPath === '/admin/support') {
    void fetchSupportRequests({ page: 1, page_size: 10 }).catch(() => {});
  }
}

/**
 * Fire Super Admin contract GETs for Luna validation on dev bootstrap.
 * Skips public routes; probes immediately and resolves auth in the background.
 */
export function runValidationContractProbes(): void {
  if (!isLunaValidationMode()) {
    return;
  }

  if (isPublicAdminRoute()) {
    return;
  }

  const normalizedPath = window.location.pathname.replace(/\/$/, '') || '/';
  if (probedPaths.has(normalizedPath)) {
    return;
  }

  probedPaths.add(normalizedPath);

  probeRouteContractGets();
  void ensureValidationAuth();
}
