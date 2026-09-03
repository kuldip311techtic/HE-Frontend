import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createSubscriptionPlan,
  deleteSubscriptionPlan,
  getSubscriptionPlans,
  updateSubscriptionPlan,
} from "@/lib/api/services/super-admin";
import type {
  SubscriptionPlanCreateRequest,
  SubscriptionPlanListParams,
  SubscriptionPlanRole,
  SubscriptionPlanUpdateRequest,
} from "@/types/api";

export function useSubscriptionPlans(params: SubscriptionPlanListParams) {
  return useQuery({
    queryKey: ["super-admin", "subscriptions", params],
    queryFn: () => getSubscriptionPlans(params),
    enabled: Boolean(params.role),
  });
}

export function useCreateSubscriptionPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SubscriptionPlanCreateRequest) =>
      createSubscriptionPlan(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["super-admin", "subscriptions"],
      });
    },
  });
}

export function useUpdateSubscriptionPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      planId,
      role,
      data,
    }: {
      planId: string;
      role: SubscriptionPlanRole;
      data: SubscriptionPlanUpdateRequest;
    }) => updateSubscriptionPlan(planId, role, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["super-admin", "subscriptions"],
      });
    },
  });
}

export function useDeleteSubscriptionPlan() {
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
    }) => deleteSubscriptionPlan(planId, role, replacementPlanId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["super-admin", "subscriptions"],
      });
    },
  });
}
