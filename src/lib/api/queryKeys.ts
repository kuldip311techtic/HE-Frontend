import type { OrganizationListParams } from '@/types/organization';
import type { AdminUserListParams } from '@/types/user';
import type { SubscriptionPlanListParams } from '@/types/subscription';
import type { SupportRequestListParams } from '@/types/support';

export const queryKeys = {
  superAdminDashboard: ['super-admin', 'dashboard'] as const,
  organizations: (params: OrganizationListParams) =>
    ['super-admin', 'organizations', params] as const,
  users: (params: AdminUserListParams) => ['super-admin', 'users', params] as const,
  subscriptionPlans: (params: SubscriptionPlanListParams) =>
    ['super-admin', 'subscription-plans', params] as const,
  subscriptionCurrencies: ['super-admin', 'subscription-plans', 'currencies'] as const,
  supportRequests: (params: SupportRequestListParams) =>
    ['super-admin', 'support-requests', params] as const,
};
