import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  archiveSubscriptionPlan,
  createSubscriptionPlan,
  updateSubscriptionPlan,
} from '@/lib/api/subscription-plans';
import type {
  SubscriptionPlanCreateRequest,
  SubscriptionPlanRole,
  SubscriptionPlanUpdateRequest,
} from '@/types/subscriptions';

export function useSubscriptionPlanMutations(role: SubscriptionPlanRole) {
  const queryClient = useQueryClient();

  const invalidateList = async () => {
    await queryClient.invalidateQueries({
      queryKey: ['super-admin', 'subscription-plans'],
    });
  };

  const create = useMutation({
    mutationFn: (payload: SubscriptionPlanCreateRequest) => createSubscriptionPlan(payload),
    onSuccess: async () => {
      await invalidateList();
      toast.success('Subscription plan created successfully.');
    },
  });

  const update = useMutation({
    mutationFn: ({
      planId,
      payload,
    }: {
      planId: string;
      payload: SubscriptionPlanUpdateRequest;
    }) => updateSubscriptionPlan(planId, role, payload),
    onSuccess: async () => {
      await invalidateList();
      toast.success('Subscription plan updated successfully.');
    },
  });

  const archive = useMutation({
    mutationFn: (planId: string) => archiveSubscriptionPlan(planId, role),
    onSuccess: async (response) => {
      await invalidateList();
      toast.success(response.message || 'Subscription plan archived successfully.');
    },
  });

  return { create, update, archive };
}
