import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../lib/api/client';
import { getApiErrorMessage } from '../lib/api/errors';
import { queryKeys } from '../lib/api/queryKeys';
import type { Organization, OrganizationPayload } from '../types/organization';

interface EditOrganizationVariables {
  id: string;
  payload: OrganizationPayload;
}

async function editOrganizationRequest({
  id,
  payload,
}: EditOrganizationVariables): Promise<Organization> {
  const { data } = await apiClient.put<Organization>(
    `/organizations/${id}`,
    payload,
  );

  return data;
}

export function useEditOrganization() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: editOrganizationRequest,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.organizations.all,
      });
    },
  });

  return {
    editOrganization: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    errorMessage: mutation.error
      ? getApiErrorMessage(
          mutation.error,
          'Unable to save organization changes. Please try again.',
        )
      : null,
    reset: mutation.reset,
  };
}
