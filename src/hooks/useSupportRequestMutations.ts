import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  closeSupportRequest,
  respondToSupportRequest,
} from "@/lib/api/services/admin";
import { getApiErrorMessage } from "@/lib/api/client";
import type { SupportRequestRespondRequest } from "@/types/api";

export function useRespondToSupportRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: SupportRequestRespondRequest) =>
      respondToSupportRequest(body),
    onSuccess: (response) => {
      void queryClient.invalidateQueries({
        queryKey: ["super-admin", "support-requests"],
      });
      toast.success(response.message || "Response sent successfully.");
    },
    onError: (error) => {
      toast.error(
        getApiErrorMessage(error, "Unable to send response. Please try again."),
      );
    },
  });
}

export function useCloseSupportRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestId: string) => closeSupportRequest(requestId),
    onSuccess: (response) => {
      void queryClient.invalidateQueries({
        queryKey: ["super-admin", "support-requests"],
      });
      toast.success(response.message || "Support request closed.");
    },
    onError: (error) => {
      toast.error(
        getApiErrorMessage(error, "Unable to close request. Please try again."),
      );
    },
  });
}
