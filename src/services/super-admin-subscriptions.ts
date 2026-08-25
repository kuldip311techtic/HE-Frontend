import { apiRequest } from "@/services/api-client";
import type {
  CreateSubscriptionRequest,
  Subscription,
  SubscriptionListData,
  SubscriptionListResponse,
  SubscriptionMutationResponse,
  UpdateSubscriptionRequest,
} from "@/types/subscription";

const SUPER_ADMIN_SUBSCRIPTIONS_PATH = "/api/super-admin/subscriptions";

function normalizeListData(
  data: SubscriptionListData | Subscription[],
): SubscriptionListData {
  if (Array.isArray(data)) {
    return {
      items: data,
      total: data.length,
    };
  }

  return {
    items: data.items ?? [],
    total: data.total ?? data.items?.length ?? 0,
  };
}

export async function fetchSubscriptions(): Promise<SubscriptionListData> {
  const response = await apiRequest<SubscriptionListResponse>(
    SUPER_ADMIN_SUBSCRIPTIONS_PATH,
    {
      method: "GET",
      auth: true,
    },
  );

  return normalizeListData(response.data);
}

export async function createSubscription(
  payload: CreateSubscriptionRequest,
): Promise<SubscriptionMutationResponse> {
  return apiRequest<SubscriptionMutationResponse>(
    SUPER_ADMIN_SUBSCRIPTIONS_PATH,
    {
      method: "POST",
      body: payload,
      auth: true,
    },
  );
}

export async function updateSubscription(
  id: string,
  payload: UpdateSubscriptionRequest,
): Promise<SubscriptionMutationResponse> {
  return apiRequest<SubscriptionMutationResponse>(
    `/api/super-admin/subscriptions/${id}`,
    {
      method: "PUT",
      body: payload,
      auth: true,
    },
  );
}

export async function deleteSubscription(
  id: string,
): Promise<SubscriptionMutationResponse> {
  return apiRequest<SubscriptionMutationResponse>(
    `/api/super-admin/subscriptions/${id}`,
    {
      method: "DELETE",
      auth: true,
    },
  );
}
