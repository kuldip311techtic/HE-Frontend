import { apiRequest } from "@/services/api-client";
import type {
  CreateSubscriptionRequest,
  Subscription,
  SubscriptionListData,
  SubscriptionMutationResponse,
  UpdateSubscriptionRequest,
} from "@/types/subscription";

const SUPER_ADMIN_SUBSCRIPTIONS_PATH = "/api/super-admin/subscriptions";
const SUBSCRIPTION_BY_ID_PATH = "/api/super-admin/subscriptions/{id}";
const SUBSCRIPTIONS_LIST_UNWRAP_KEY = "data" as const;

function resolveSubscriptionByIdPath(id: string): string {
  return SUBSCRIPTION_BY_ID_PATH.replace("{id}", id);
}

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
  const response = await apiRequest<unknown>(SUPER_ADMIN_SUBSCRIPTIONS_PATH, {
    method: "GET",
    auth: true,
  });

  const record =
    typeof response === "object" && response !== null
      ? (response as Record<string, unknown>)
      : {};

  const listBody = (record[SUBSCRIPTIONS_LIST_UNWRAP_KEY] ??
    response) as SubscriptionListData | Subscription[];

  return normalizeListData(listBody);
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
    resolveSubscriptionByIdPath(id),
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
    resolveSubscriptionByIdPath(id),
    {
      method: "DELETE",
      auth: true,
    },
  );
}
