import { apiRequest } from "@/services/api-client";
import {
  SUBSCRIPTION_API_PATH,
  subscriptionDetailPath,
  type CreateSubscriptionRequest,
  type Subscription,
  type SubscriptionListData,
  type SubscriptionListResponse,
  type SubscriptionMutationResponse,
  type UpdateSubscriptionRequest,
} from "@/types/subscription";

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
    SUBSCRIPTION_API_PATH,
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
    SUBSCRIPTION_API_PATH,
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
    subscriptionDetailPath(id),
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
    subscriptionDetailPath(id),
    {
      method: "DELETE",
      auth: true,
    },
  );
}
