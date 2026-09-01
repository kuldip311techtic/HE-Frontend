import { apiRequest, unwrapList } from "@/services/api-client";
import type {
  CreateSubscriptionRequest,
  SubscriptionPlan,
  SubscriptionsListResponse,
  UpdateSubscriptionRequest,
} from "@/types/super-admin";

function unwrapSubscriptions(
  response: SubscriptionsListResponse | SubscriptionPlan[]
): SubscriptionPlan[] {
  if (Array.isArray(response)) {
    return response;
  }

  for (const key of ["items", "data", "results"] as const) {
    const list = unwrapList<SubscriptionPlan>(
      response as Record<string, unknown>,
      key
    );
    if (list.length > 0) {
      return list;
    }
  }

  return (
    response.items ??
    response.data ??
    response.results ??
    []
  );
}

export async function listSubscriptions(): Promise<SubscriptionPlan[]> {
  const response = await apiRequest<
    SubscriptionsListResponse | SubscriptionPlan[]
  >("/api/super-admin/subscriptions", {
    method: "GET",
  });
  return unwrapSubscriptions(response);
}

export async function createSubscription(
  data: CreateSubscriptionRequest
): Promise<SubscriptionPlan> {
  return apiRequest<SubscriptionPlan>("/api/super-admin/subscriptions", {
    method: "POST",
    body: data,
  });
}

export async function updateSubscription(
  id: string,
  data: UpdateSubscriptionRequest
): Promise<SubscriptionPlan> {
  return apiRequest<SubscriptionPlan>(`/api/super-admin/subscriptions/${id}`, {
    method: "PUT",
    body: data,
  });
}

export async function deleteSubscription(id: string): Promise<{ message?: string }> {
  return apiRequest<{ message?: string }>(
    `/api/super-admin/subscriptions/${id}`,
    {
      method: "DELETE",
    }
  );
}
