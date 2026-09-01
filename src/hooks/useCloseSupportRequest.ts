import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/lib/api/query-keys";
import { ApiClientError } from "@/services/api-client";
import { closeSupportRequest } from "@/services/super-admin-support-requests";

export function useCloseSupportRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => closeSupportRequest(id),
    onSuccess: (response) => {
      toast.success(response.message || "Support request closed successfully.");
      void queryClient.invalidateQueries({
        queryKey: queryKeys.superAdmin.supportRequests,
      });
    },
    onError: (error: Error) => {
      if (error instanceof ApiClientError) {
        toast.error(error.message);
        return;
      }
      toast.error("Unable to close support request. Please try again.");
    },
  });
}
