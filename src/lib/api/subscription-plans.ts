import { apiClient } from '@/lib/api/client';
import type {
  SubscriptionPlanArchiveResponse,
  SubscriptionPlanCreateRequest,
  SubscriptionPlanItem,
  SubscriptionPlanListParams,
  SubscriptionPlanListResponse,
  SubscriptionPlanRole,
  SubscriptionPlanUpdateRequest,
} from '@/types/api';

export async function fetchSubscriptionPlans(
  params: SubscriptionPlanListParams,
): Promise<SubscriptionPlanListResponse> {
  const { data } = await apiClient.get<SubscriptionPlanListResponse>(
    '/super-admin/subscriptions',
    { params },
  );
  return data;
}

export async function createSubscriptionPlan(
  body: SubscriptionPlanCreateRequest,
): Promise<SubscriptionPlanItem> {
  const { data } = await apiClient.post<SubscriptionPlanItem>(
    '/super-admin/subscriptions',
    body,
  );
  return data;
}

export async function updateSubscriptionPlan(
  planId: string,
  role: SubscriptionPlanRole,
  body: SubscriptionPlanUpdateRequest,
): Promise<SubscriptionPlanItem> {
  const { data } = await apiClient.put<SubscriptionPlanItem>(
    `/super-admin/subscriptions/${planId}`,
    body,
    { params: { role } },
  );
  return data;
}

export async function archiveSubscriptionPlan(
  planId: string,
  role: SubscriptionPlanRole,
  replacementPlanId?: string,
): Promise<SubscriptionPlanArchiveResponse> {
  const { data } = await apiClient.delete<SubscriptionPlanArchiveResponse>(
    `/super-admin/subscriptions/${planId}`,
    {
      params: {
        role,
        ...(replacementPlanId ? { replacement_plan_id: replacementPlanId } : {}),
      },
    },
  );
  return data;
}

export function isActiveSubscriptionPlan(plan: SubscriptionPlanItem): boolean {
  return plan.status === 'active' || plan.is_active;
}

export function formatBillingFrequency(frequency: string): string {
  switch (frequency) {
    case 'monthly':
      return 'Monthly';
    case 'yearly':
      return 'Yearly';
    default:
      return frequency;
  }
}

export function formatPlanPrice(currency: string, amount: string): string {
  const numericAmount = Number(amount);
  if (Number.isNaN(numericAmount)) {
    return `${currency} ${amount}`;
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
  }).format(numericAmount);
}

export function getSubscriptionRoleLabel(role: SubscriptionPlanRole): string {
  return role === 'org_admin' ? 'Organization Admin Plans' : 'Coach Plans';
}

export function buildDefaultCreatePayload(
  role: SubscriptionPlanRole,
): SubscriptionPlanCreateRequest {
  return {
    role,
    name: '',
    billing_frequency: 'monthly',
    currency: 'USD',
    price_amount: '0',
    teams_limit_type: 'unlimited',
    teams_count: null,
    coaches_limit_type: 'unlimited',
    coaches_count: null,
    players_limit_type: 'unlimited',
    players_count: null,
    historical_records_duration: '1_year',
    is_active: true,
    include_offline_sync: false,
    description: null,
    features: [],
  };
}
