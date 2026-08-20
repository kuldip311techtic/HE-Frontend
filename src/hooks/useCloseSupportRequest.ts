import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../lib/api/client';
import { getApiErrorMessage } from '../lib/api/errors';
import { queryKeys } from '../lib/api/queryKeys';
import type { CloseSupportRequestResponse } from '../types/supportRequest';

async function closeSupportRequestRequest(
  id: string,
): Promise<CloseSupportRequestResponse> {
  const { data } = await apiClient.delete<CloseSupportRequestResponse>(
    `/support-requests/${id}`,
  );

  return data;
}

export function useCloseSupportRequest() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: closeSupportRequestRequest,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.supportRequests.all,
      });
    },
  });

  return {
    closeSupportRequest: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    errorMessage: mutation.error
      ? getApiErrorMessage(
          mutation.error,
          'Unable to close support request. Please try again.',
        )
      : null,
    reset: mutation.reset,
  };
}
