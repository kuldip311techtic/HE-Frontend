import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { ApiClientError } from "@/services/api-client";
import { updateSubscription } from "@/services/super-admin-subscriptions";
import type { EditSubscriptionVariables } from "@/types/subscription";

export function useEditSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: EditSubscriptionVariables) =>
      updateSubscription(id, payload),
    onSuccess: (response) => {
      toast.success(response.message || "Subscription plan updated successfully.");
      void queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
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
