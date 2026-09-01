import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/lib/api/query-keys";
import { formValuesToUpdateRequest } from "@/lib/subscription-helpers";
import { ApiClientError } from "@/services/api-client";
import { updateSubscription } from "@/services/super-admin-subscriptions";
import type { EditSubscriptionVariables } from "@/types/subscription";

export function useEditSubscriptionPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, values }: EditSubscriptionVariables) =>
      updateSubscription(id, formValuesToUpdateRequest(values)),
    onSuccess: (response) => {
      toast.success(response.message || "Subscription plan updated successfully.");
      void queryClient.invalidateQueries({
        queryKey: queryKeys.superAdmin.subscriptions,
      });
    },
    onError: (error: Error) => {
      if (error instanceof ApiClientError) {
        toast.error(error.message);
        return;
      }
      toast.error("Unable to update subscription plan. Please try again.");
    },
  });
}
