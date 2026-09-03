import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createSubscriptionPlan,
  deleteSubscriptionPlan,
  updateSubscriptionPlan,
} from "@/lib/api/services/admin";
import { getApiErrorMessage } from "@/lib/api/client";
import type {
  SubscriptionPlanCreateRequest,
  SubscriptionPlanRole,
  SubscriptionPlanUpdateRequest,
} from "@/types/api";

export function useCreateSubscriptionPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: SubscriptionPlanCreateRequest) =>
      createSubscriptionPlan(body),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["super-admin", "subscription-plans"],
      });
      toast.success("Subscription plan created successfully.");
    },
    onError: (error) => {
      toast.error(
        getApiErrorMessage(error, "Unable to create plan. Please try again."),
      );
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
      void queryClient.invalidateQueries({
        queryKey: ["super-admin", "subscription-plans"],
      });
      toast.success("Changes saved successfully.");
    },
    onError: (error) => {
      toast.error(
        getApiErrorMessage(error, "Unable to save changes. Please try again."),
      );
    },
  });
}

export function useDeleteSubscriptionPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      planId,
      role,
    }: {
      planId: string;
      role: SubscriptionPlanRole;
    }) => deleteSubscriptionPlan(planId, role),
    onSuccess: (response) => {
      void queryClient.invalidateQueries({
        queryKey: ["super-admin", "subscription-plans"],
      });
      toast.success(response.message || "Subscription plan removed successfully.");
    },
    onError: (error) => {
      toast.error(
        getApiErrorMessage(error, "Unable to remove plan. Please try again."),
      );
    },
  });
}
