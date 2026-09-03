import type {
  CurrencyItem,
  SubscriptionPlanCreateRequest,
  SubscriptionPlanDeleteResponse,
  SubscriptionPlanItem,
  SubscriptionPlanListParams,
  SubscriptionPlanListResponse,
  SubscriptionPlanRole,
  SubscriptionPlanUpdateRequest,
} from '@/types/subscriptions';
import { apiClient } from './client';
import {
  CONTRACT_ROUTES,
  contractPathToClientPath,
  contractPathWithParams,
  unwrapListResponse,
} from './endpoints';

const listRoute = CONTRACT_ROUTES.superAdminSubscriptionPlans;
const createRoute = CONTRACT_ROUTES.superAdminSubscriptionPlansCreate;
const currenciesRoute = CONTRACT_ROUTES.superAdminSubscriptionPlansCurrencies;

/** GET /api/v1/super-admin/subscription-plans */
export async function fetchSubscriptionPlans(
  params: SubscriptionPlanListParams,
): Promise<SubscriptionPlanListResponse> {
  const { data } = await apiClient.request<SubscriptionPlanListResponse>({
    method: listRoute.method,
    url: contractPathToClientPath(listRoute.path),
    params: {
      role: params.role,
      page: params.page ?? 1,
      page_size: params.page_size ?? 10,
      ...(params.status ? { status: params.status } : {}),
      ...(params.billing_frequency ? { billing_frequency: params.billing_frequency } : {}),
      ...(params.search?.trim() ? { search: params.search.trim() } : {}),
    },
  });
  return data;
}

/** POST /api/v1/super-admin/subscription-plans */
export async function createSubscriptionPlan(
  payload: SubscriptionPlanCreateRequest,
): Promise<SubscriptionPlanItem> {
  const { data } = await apiClient.request<SubscriptionPlanItem>({
    method: createRoute.method,
    url: contractPathToClientPath(createRoute.path),
    data: payload,
  });
  return data;
}

/** PUT /api/super-admin/subscriptions/{id} */
export async function updateSubscriptionPlan(
  planId: string,
  _role: SubscriptionPlanRole,
  payload: SubscriptionPlanUpdateRequest,
): Promise<SubscriptionPlanItem> {
  const updateRoute = CONTRACT_ROUTES.superAdminSubscriptionUpdate;
  const contractPath = contractPathWithParams(updateRoute.path, { id: planId });
  const { data } = await apiClient.request<SubscriptionPlanItem>({
    method: updateRoute.method,
    url: contractPathToClientPath(contractPath),
    data: payload,
  });
  return data;
}

/** DELETE /api/super-admin/subscriptions/{id} */
export async function archiveSubscriptionPlan(
  planId: string,
  _role: SubscriptionPlanRole,
): Promise<SubscriptionPlanDeleteResponse> {
  const deleteRoute = CONTRACT_ROUTES.superAdminSubscriptionDelete;
  const contractPath = contractPathWithParams(deleteRoute.path, { id: planId });
  const { data } = await apiClient.request<SubscriptionPlanDeleteResponse>({
    method: deleteRoute.method,
    url: contractPathToClientPath(contractPath),
  });
  return data;
}

/** GET /api/v1/super-admin/subscription-plans/currencies */
export async function fetchCurrencies(): Promise<CurrencyItem[]> {
  const { data } = await apiClient.request<{ items: CurrencyItem[] } | CurrencyItem[]>({
    method: currenciesRoute.method,
    url: contractPathToClientPath(currenciesRoute.path),
  });
  const items = unwrapListResponse<CurrencyItem[]>(data, currenciesRoute.listUnwrapKey);
  return Array.isArray(items) ? items : [];
}
