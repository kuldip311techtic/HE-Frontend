import axios from 'axios';
import apiClient from '@/lib/api/client';
import type { ErrorResponse } from '@/types/api';
import type {
  CreateSubscriptionPlanRequest,
  SubscriptionPlanListResponse,
  SubscriptionPlanMutationResponse,
  UpdateSubscriptionPlanRequest,
} from '@/types/subscription';

const SUBSCRIPTIONS_PATH = '/super-admin/subscriptions';

export async function fetchSubscriptionPlans(): Promise<
  SubscriptionPlanListResponse['data']
> {
  const { data } =
    await apiClient.get<SubscriptionPlanListResponse>(SUBSCRIPTIONS_PATH);

  if (!data.success) {
    throw new Error(data.message || 'Failed to load subscription plans.');
  }

  return data.data;
}

export async function createSubscriptionPlan(
  payload: CreateSubscriptionPlanRequest,
): Promise<SubscriptionPlanMutationResponse> {
  const { data } = await apiClient.post<SubscriptionPlanMutationResponse>(
    SUBSCRIPTIONS_PATH,
    payload,
  );

  if (!data.success) {
    throw new Error(data.message || 'Failed to create subscription plan.');
  }

  return data;
}

export async function updateSubscriptionPlan(
  id: string,
  payload: UpdateSubscriptionPlanRequest,
): Promise<SubscriptionPlanMutationResponse> {
  const { data } = await apiClient.put<SubscriptionPlanMutationResponse>(
    `${SUBSCRIPTIONS_PATH}/${id}`,
    payload,
  );

  if (!data.success) {
    throw new Error(data.message || 'Failed to update subscription plan.');
  }

  return data;
}

export async function deleteSubscriptionPlan(
  id: string,
): Promise<SubscriptionPlanMutationResponse> {
  const { data } = await apiClient.delete<SubscriptionPlanMutationResponse>(
    `${SUBSCRIPTIONS_PATH}/${id}`,
  );

  if (!data.success) {
    throw new Error(data.message || 'Failed to delete subscription plan.');
  }

  return data;
}

export function getSubscriptionErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ErrorResponse>(error)) {
    if (!error.response) {
      return 'Unable to reach the server. Check your connection and try again.';
    }

    return error.response.data?.message ?? 'Something went wrong. Please try again.';
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'Something went wrong. Please try again.';
}
