import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/api/queryKeys';
import {
  closeSupportRequest,
  listSupportRequests,
  respondToSupportRequest,
} from '@/lib/api/services/supportRequests';
import type { SupportRequestListParams, SupportRespondRequest } from '@/types/support';

const supportRequestsRootKey = ['super-admin', 'support-requests'] as const;

export function useSupportRequests(params: SupportRequestListParams) {
  return useQuery({
    queryKey: queryKeys.supportRequests(params),
    queryFn: () => listSupportRequests(params),
  });
}

export function useRespondToSupportRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SupportRespondRequest) => respondToSupportRequest(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: supportRequestsRootKey });
    },
  });
}

export function useCloseSupportRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (requestId: string) => closeSupportRequest(requestId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: supportRequestsRootKey });
    },
  });
}
