import { apiRequest } from '@/lib/api/request';
import { endpoints } from '@/lib/api/endpoints';
import { unwrapItems } from '@/lib/api/unwrapList';
import type {
  CurrencyListResponse,
  SubscriptionPlanCreateRequest,
  SubscriptionPlanDeleteResponse,
  SubscriptionPlanListParams,
  SubscriptionPlanListResponse,
  SubscriptionPlanUpdateRequest,
  SubscriptionPlanItem,
} from '@/types/subscription';

export async function listSubscriptionPlans(
  params: SubscriptionPlanListParams,
): Promise<SubscriptionPlanListResponse> {
  const data = await apiRequest<SubscriptionPlanListResponse | SubscriptionPlanItem[]>(
    endpoints.subscriptionPlansList,
    { params },
  );
  const items = unwrapItems<SubscriptionPlanItem>(data);
  if (Array.isArray(data)) {
    return { items, counts: { active: 0, archived: 0 } };
  }
  return {
    ...data,
    items,
    counts: data.counts ?? { active: 0, archived: 0 },
  };
}

export async function createSubscriptionPlan(
  payload: SubscriptionPlanCreateRequest,
): Promise<SubscriptionPlanItem> {
  return apiRequest<SubscriptionPlanItem>(endpoints.subscriptionPlansCreate, { data: payload });
}

export async function updateSubscriptionPlan(
  planId: string,
  payload: SubscriptionPlanUpdateRequest,
  role: SubscriptionPlanListParams['role'],
): Promise<SubscriptionPlanItem> {
  return apiRequest<SubscriptionPlanItem>(endpoints.subscriptionPlansUpdate, {
    pathParams: { plan_id: planId },
    params: { role },
    data: payload,
  });
}

export async function archiveSubscriptionPlan(
  planId: string,
  role: SubscriptionPlanListParams['role'],
  replacementPlanId?: string,
): Promise<SubscriptionPlanDeleteResponse> {
  return apiRequest<SubscriptionPlanDeleteResponse>(endpoints.subscriptionPlansDelete, {
    pathParams: { plan_id: planId },
    params: { role, replacement_plan_id: replacementPlanId },
  });
}

export async function listSubscriptionCurrencies(): Promise<string[]> {
  const data = await apiRequest<CurrencyListResponse | string[]>(endpoints.subscriptionCurrencies);
  if (Array.isArray(data)) {
    return data.filter((item): item is string => typeof item === 'string');
  }
  const fromItems = (data.items ?? []).map((item) =>
    typeof item === 'string' ? item : item.code,
  );
  if (fromItems.length > 0) return fromItems;
  return data.currencies ?? [];
}
