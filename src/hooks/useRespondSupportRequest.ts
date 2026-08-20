import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../lib/api/client';
import { getApiErrorMessage } from '../lib/api/errors';
import { queryKeys } from '../lib/api/queryKeys';
import type {
  SupportRequest,
  SupportRequestResponsePayload,
} from '../types/supportRequest';

async function respondSupportRequestRequest(
  payload: SupportRequestResponsePayload,
): Promise<SupportRequest> {
  const { data } = await apiClient.post<SupportRequest>(
    '/support-requests',
    payload,
  );

  return data;
}

export function useRespondSupportRequest() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: respondSupportRequestRequest,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.supportRequests.all,
      });
    },
  });

  return {
    respondSupportRequest: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    errorMessage: mutation.error
      ? getApiErrorMessage(
          mutation.error,
          'Unable to send response. Please try again.',
        )
      : null,
    reset: mutation.reset,
  };
}
