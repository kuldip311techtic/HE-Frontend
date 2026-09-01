import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/lib/api/query-keys";
import { ApiClientError } from "@/services/api-client";
import { deleteSubscription } from "@/services/super-admin-subscriptions";

export function useRemoveSubscriptionPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteSubscription(id),
    onSuccess: (response) => {
      toast.success(response.message || "Subscription plan removed successfully.");
      void queryClient.invalidateQueries({
        queryKey: queryKeys.superAdmin.subscriptions,
      });
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
