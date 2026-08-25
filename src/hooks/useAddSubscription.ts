import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { formValuesToCreateRequest } from "@/lib/subscription-helpers";
import { ApiClientError } from "@/services/api-client";
import { createSubscription } from "@/services/super-admin-subscriptions";
import type { SubscriptionFormValues } from "@/types/subscription";

export function useAddSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: SubscriptionFormValues) =>
      createSubscription(formValuesToCreateRequest(values)),
    onSuccess: (response) => {
      toast.success(response.message || "Subscription plan created successfully.");
      void queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
    },
    onError: (error: Error) => {
      if (error instanceof ApiClientError) {
        toast.error(error.message);
        return;
      }
      toast.error("Unable to create subscription plan. Please try again.");
    },
  });
}
