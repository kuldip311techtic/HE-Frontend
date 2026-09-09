import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/api/queryKeys';
import {
  archiveSubscriptionPlan,
  createSubscriptionPlan,
  listSubscriptionCurrencies,
  listSubscriptionPlans,
  updateSubscriptionPlan,
} from '@/lib/api/services/subscriptionPlans';
import type {
  SubscriptionPlanCreateRequest,
  SubscriptionPlanListParams,
  SubscriptionPlanRole,
  SubscriptionPlanUpdateRequest,
} from '@/types/subscription';

const subscriptionPlansRootKey = ['super-admin', 'subscription-plans'] as const;

export function useSubscriptionPlans(params: SubscriptionPlanListParams, enabled = true) {
  return useQuery({
    queryKey: queryKeys.subscriptionPlans(params),
    queryFn: () => listSubscriptionPlans(params),
    enabled,
  });
}

export function useSubscriptionCurrencies() {
  return useQuery({
    queryKey: queryKeys.subscriptionCurrencies,
    queryFn: listSubscriptionCurrencies,
  });
}

export function useCreateSubscriptionPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SubscriptionPlanCreateRequest) => createSubscriptionPlan(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: subscriptionPlansRootKey });
    },
  });
}

export function useUpdateSubscriptionPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      planId,
      payload,
      role,
    }: {
      planId: string;
      payload: SubscriptionPlanUpdateRequest;
      role: SubscriptionPlanRole;
    }) => updateSubscriptionPlan(planId, payload, role),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: subscriptionPlansRootKey });
    },
  });
}

export function useArchiveSubscriptionPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      planId,
      role,
      replacementPlanId,
    }: {
      planId: string;
      role: SubscriptionPlanRole;
      replacementPlanId?: string;
    }) => archiveSubscriptionPlan(planId, role, replacementPlanId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: subscriptionPlansRootKey });
    },
  });
}
