import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/api/queryKeys';
import {
  fetchSupportRequests,
  respondToSupportRequest,
  updateSupportRequest,
} from '@/lib/api/services/support';
import type {
  SupportRequestRespondRequest,
  SupportRequestUpdateRequest,
} from '@/types/support';

export function useSupportRequestsList() {
  return useQuery({
    queryKey: queryKeys.supportRequests.all,
    queryFn: fetchSupportRequests,
  });
}

export function useRespondToSupportRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SupportRequestRespondRequest) => respondToSupportRequest(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.supportRequests.all });
    },
  });
}

export function useUpdateSupportRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: SupportRequestUpdateRequest }) =>
      updateSupportRequest(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.supportRequests.all });
    },
  });
}
