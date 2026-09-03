import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  closeSupportRequest,
  getSupportRequests,
  respondToSupportRequest,
} from "@/lib/api/services/super-admin";
import type {
  SupportRequestListParams,
  SupportRequestRespondRequest,
} from "@/types/api";

export function useSupportRequests(params: SupportRequestListParams) {
  return useQuery({
    queryKey: ["super-admin", "support-requests", params],
    queryFn: () => getSupportRequests(params),
    retry: false,
  });
}

export function useRespondSupportRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SupportRequestRespondRequest) =>
      respondToSupportRequest(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["super-admin", "support-requests"],
      });
    },
  });
}

export function useCloseSupportRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (requestId: string) => closeSupportRequest(requestId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["super-admin", "support-requests"],
      });
    },
  });
}
