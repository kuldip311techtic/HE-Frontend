import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../lib/api/client';
import { getApiErrorMessage } from '../lib/api/errors';
import { queryKeys } from '../lib/api/queryKeys';
import type { DeleteUserResponse } from '../types/user';

async function removeUserRequest(id: string): Promise<DeleteUserResponse> {
  const { data } = await apiClient.delete<DeleteUserResponse>(`/users/${id}`);

  return data;
}

export function useRemoveUser() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: removeUserRequest,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.users.all,
      });
    },
  });

  return {
    removeUser: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    errorMessage: mutation.error
      ? getApiErrorMessage(
          mutation.error,
          'Unable to remove user. Please try again.',
        )
      : null,
    reset: mutation.reset,
  };
}
