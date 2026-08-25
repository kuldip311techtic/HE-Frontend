import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { SUPPORT_REQUESTS_QUERY_KEY } from '@/lib/api/queryKeys';
import {
  closeSupportRequest,
  fetchSupportRequests,
  getSupportRequestErrorMessage,
  respondToSupportRequest,
} from '@/services/supportRequests';
import type { RespondToSupportRequestRequest } from '@/types/supportRequest';

export function useSupportRequests() {
  return useQuery({
    queryKey: SUPPORT_REQUESTS_QUERY_KEY,
    queryFn: fetchSupportRequests,
  });
}

export function useRespondToSupportRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RespondToSupportRequestRequest) =>
      respondToSupportRequest(payload),
    onSuccess: (response) => {
      void queryClient.invalidateQueries({
        queryKey: SUPPORT_REQUESTS_QUERY_KEY,
      });
      toast.success(response.message || 'Response sent successfully.');
    },
    onError: (error) => {
      toast.error(getSupportRequestErrorMessage(error));
    },
  });
}

export function useCloseSupportRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => closeSupportRequest(id),
    onSuccess: (response) => {
      void queryClient.invalidateQueries({
        queryKey: SUPPORT_REQUESTS_QUERY_KEY,
      });
      toast.success(response.message || 'Support request closed successfully.');
    },
    onError: (error) => {
      toast.error(getSupportRequestErrorMessage(error));
    },
  });
}
