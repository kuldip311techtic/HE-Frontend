import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../lib/api/client';
import { getApiErrorMessage } from '../lib/api/errors';
import { queryKeys } from '../lib/api/queryKeys';
import {
  ORGANIZATIONS_API_PATH,
  type Organization,
  type OrganizationPayload,
} from '../types/organization';

async function addOrganizationRequest(
  payload: OrganizationPayload,
): Promise<Organization> {
  const { data } = await apiClient.post<Organization>(
    ORGANIZATIONS_API_PATH,
    payload,
  );

  return data;
}

export function useAddOrganization() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: addOrganizationRequest,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.organizations.all,
      });
    },
  });

  return {
    addOrganization: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    errorMessage: mutation.error
      ? getApiErrorMessage(
          mutation.error,
          'Unable to add organization. Please try again.',
        )
      : null,
    reset: mutation.reset,
  };
}
