import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../lib/api/client';
import { getApiErrorMessage } from '../lib/api/errors';
import { queryKeys } from '../lib/api/queryKeys';
import {
  ORGANIZATIONS_API_PATH,
  type DeleteOrganizationResponse,
} from '../types/organization';

async function removeOrganizationRequest(
  id: string,
): Promise<DeleteOrganizationResponse> {
  const { data } = await apiClient.delete<DeleteOrganizationResponse>(
    `${ORGANIZATIONS_API_PATH}/${id}`,
  );

  return data;
}

export function useRemoveOrganization() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: removeOrganizationRequest,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.organizations.all,
      });
    },
  });

  return {
    removeOrganization: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    errorMessage: mutation.error
      ? getApiErrorMessage(
          mutation.error,
          'Unable to remove organization. Please try again.',
        )
      : null,
    reset: mutation.reset,
  };
}
