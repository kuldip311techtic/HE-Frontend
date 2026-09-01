import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { ApiClientError, apiRequest } from "@/services/api-client";
import {
  subscriptionDetailPath,
  type SubscriptionMutationResponse,
} from "@/types/subscription";

export function useDeleteSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiRequest<SubscriptionMutationResponse>(subscriptionDetailPath(id), {
        method: "DELETE",
        auth: true,
      }),
    onSuccess: (response) => {
      toast.success(response.message || "Subscription plan removed successfully.");
      void queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
    },
    onError: (error: Error) => {
      if (error instanceof ApiClientError) {
        toast.error(error.message);
        return;
      }
      toast.error("Unable to remove subscription plan. Please try again.");
    },
  });
}
