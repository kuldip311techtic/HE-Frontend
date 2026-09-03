import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  archiveSubscriptionPlan,
  createSubscriptionPlan,
  updateSubscriptionPlan,
} from '@/lib/api/subscription-plans';
import type {
  SubscriptionPlanCreateRequest,
  SubscriptionPlanRole,
  SubscriptionPlanUpdateRequest,
} from '@/types/api';

export function useCreateSubscriptionPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: SubscriptionPlanCreateRequest) => createSubscriptionPlan(body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['super-admin', 'subscription-plans'] });
    },
  });
}

export function useUpdateSubscriptionPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      planId,
      role,
      body,
    }: {
      planId: string;
      role: SubscriptionPlanRole;
      body: SubscriptionPlanUpdateRequest;
    }) => updateSubscriptionPlan(planId, role, body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['super-admin', 'subscription-plans'] });
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
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['super-admin', 'subscription-plans'] });
    },
  });
}
