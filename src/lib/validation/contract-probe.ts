import { fetchDashboardAnalytics } from '@/lib/api/dashboard';
import { fetchOrganizations } from '@/lib/api/organizations';
import { fetchSubscriptionPlans } from '@/lib/api/subscription-plans';
import { fetchSupportRequests } from '@/lib/api/support-requests';
import { fetchUsers } from '@/lib/api/users';
import { isLunaContractProbesEnabled } from '@/lib/validation/config';

const probedRoutes = new Set<string>();

function normalizeAdminRoute(pathname: string): string {
  const normalized = pathname.replace(/\/$/, '') || '/';
  if (normalized === '/admin/dashboard') {
    return '/admin';
  }
  return normalized;
}

function swallowProbeError(): void {
  // Probes are for Luna contract recording only; screens handle user-visible failures.
}

/**
 * Fire Super Admin contract GETs for the current route when Luna contract probes are enabled.
 * Skips public routes; each admin route is probed at most once per session.
 */
export function runValidationContractProbes(pathname = window.location.pathname): void {
  if (!import.meta.env.DEV || !isLunaContractProbesEnabled()) {
    return;
  }

  const route = normalizeAdminRoute(pathname);
  if (route === '/admin/login' || route === '/admin/unauthorized') {
    return;
  }

  if (probedRoutes.has(route)) {
    return;
  }

  probedRoutes.add(route);

  switch (route) {
    case '/admin':
      void fetchDashboardAnalytics().catch(swallowProbeError);
      break;
    case '/admin/organizations':
      void fetchOrganizations({ page: 1, page_size: 10 }).catch(swallowProbeError);
      break;
    case '/admin/users':
      void fetchUsers({ page: 1, page_size: 10, role: 'coach' }).catch(swallowProbeError);
      break;
    case '/admin/subscriptions':
      void fetchSubscriptionPlans({
        role: 'org_admin',
        page: 1,
        page_size: 10,
      }).catch(swallowProbeError);
      break;
    case '/admin/support':
      void fetchSupportRequests({ page: 1, page_size: 10 }).catch(swallowProbeError);
      break;
    default:
      break;
  }
}
