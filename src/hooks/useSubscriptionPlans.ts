import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createSubscriptionPlan,
  deleteSubscriptionPlan,
  getSubscriptionPlans,
  updateSubscriptionPlan,
} from "@/lib/api/services/admin";
import { getApiErrorMessage } from "@/lib/api/client";
import type {
  ListQueryParams,
  SubscriptionPlanCreateRequest,
  SubscriptionPlanRole,
  SubscriptionPlanUpdateRequest,
} from "@/types/api";

export function useSubscriptionPlans(
  role: SubscriptionPlanRole,
  params: Omit<ListQueryParams, "role">,
) {
  return useQuery({
    queryKey: ["super-admin", "subscription-plans", role, params],
    queryFn: () => getSubscriptionPlans(role, params),
  });
}

export function useSubscriptionPlanMutations(role: SubscriptionPlanRole) {
  const queryClient = useQueryClient();

  const invalidate = () =>
    void queryClient.invalidateQueries({
      queryKey: ["super-admin", "subscription-plans", role],
    });

  const createMutation = useMutation({
    mutationFn: (data: SubscriptionPlanCreateRequest) =>
      createSubscriptionPlan(data),
    onSuccess: () => {
      invalidate();
      toast.success("Subscription plan created successfully.");
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: SubscriptionPlanUpdateRequest;
    }) => updateSubscriptionPlan(id, role, data),
    onSuccess: () => {
      invalidate();
      toast.success("Changes saved successfully.");
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  const deleteMutation = useMutation({
    mutationFn: ({
      id,
      replacementPlanId,
    }: {
      id: string;
      replacementPlanId?: string;
    }) => deleteSubscriptionPlan(id, role, replacementPlanId),
    onSuccess: (response) => {
      invalidate();
      toast.success(response.message || "Plan archived successfully.");
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  return { createMutation, updateMutation, deleteMutation };
}
