import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { SUBSCRIPTIONS_QUERY_KEY } from '@/lib/api/queryKeys';
import {
  createSubscriptionPlan,
  deleteSubscriptionPlan,
  fetchSubscriptionPlans,
  getSubscriptionErrorMessage,
  updateSubscriptionPlan,
} from '@/services/subscriptions';
import type {
  CreateSubscriptionPlanRequest,
  UpdateSubscriptionPlanRequest,
} from '@/types/subscription';

export function useSubscriptionPlans() {
  return useQuery({
    queryKey: SUBSCRIPTIONS_QUERY_KEY,
    queryFn: fetchSubscriptionPlans,
  });
}

export function useCreateSubscriptionPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSubscriptionPlanRequest) =>
      createSubscriptionPlan(payload),
    onSuccess: (response) => {
      void queryClient.invalidateQueries({ queryKey: SUBSCRIPTIONS_QUERY_KEY });
      toast.success(
        response.message || 'Subscription plan created successfully.',
      );
    },
    onError: (error) => {
      toast.error(getSubscriptionErrorMessage(error));
    },
  });
}

export function useUpdateSubscriptionPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateSubscriptionPlanRequest;
    }) => updateSubscriptionPlan(id, payload),
    onSuccess: (response) => {
      void queryClient.invalidateQueries({ queryKey: SUBSCRIPTIONS_QUERY_KEY });
      toast.success(
        response.message || 'Subscription plan updated successfully.',
      );
    },
    onError: (error) => {
      toast.error(getSubscriptionErrorMessage(error));
    },
  });
}

export function useDeleteSubscriptionPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteSubscriptionPlan(id),
    onSuccess: (response) => {
      void queryClient.invalidateQueries({ queryKey: SUBSCRIPTIONS_QUERY_KEY });
      toast.success(
        response.message || 'Subscription plan removed successfully.',
      );
    },
    onError: (error) => {
      toast.error(getSubscriptionErrorMessage(error));
    },
  });
}
