import { apiClient, resolveApiPath } from '@/lib/api/client';
import { endpoints, withPathParam } from '@/lib/api/endpoints';
import type {
  SubscriptionListResponse,
  SubscriptionMutationResponse,
  SubscriptionWriteRequest,
} from '@/types/subscription';

export async function fetchSubscriptions(): Promise<SubscriptionListResponse> {
  const { method, path } = endpoints.subscriptions.list;
  const { data } = await apiClient.request<SubscriptionListResponse>({
    method,
    url: resolveApiPath(path),
  });
  return data;
}

export async function createSubscription(
  payload: SubscriptionWriteRequest,
): Promise<SubscriptionMutationResponse> {
  const { method, path } = endpoints.subscriptions.create;
  const { data } = await apiClient.request<SubscriptionMutationResponse>({
    method,
    url: resolveApiPath(path),
    data: payload,
  });
  return data;
}

export async function updateSubscription(
  id: string,
  payload: SubscriptionWriteRequest,
): Promise<SubscriptionMutationResponse> {
  const { method, path } = endpoints.subscriptions.update;
  const { data } = await apiClient.request<SubscriptionMutationResponse>({
    method,
    url: resolveApiPath(withPathParam(path, id)),
    data: payload,
  });
  return data;
}

export async function deleteSubscription(id: string): Promise<{ message: string }> {
  const { method, path } = endpoints.subscriptions.delete;
  const { data } = await apiClient.request<{ message: string }>({
    method,
    url: resolveApiPath(withPathParam(path, id)),
  });
  return data;
}
