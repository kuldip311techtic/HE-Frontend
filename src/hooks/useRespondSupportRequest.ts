import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { ApiClientError } from "@/services/api-client";
import { respondToSupportRequest } from "@/services/super-admin-support-requests";
import type { RespondSupportRequestPayload } from "@/types/support-request";

export function useRespondSupportRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RespondSupportRequestPayload) =>
      respondToSupportRequest(payload),
    onSuccess: (response) => {
      toast.success(response.message || "Response submitted successfully.");
      void queryClient.invalidateQueries({ queryKey: ["support-requests"] });
    },
    onError: (error: Error) => {
      if (error instanceof ApiClientError) {
        toast.error(error.message);
        return;
      }
      toast.error("Unable to submit response. Please try again.");
    },
  });
}
