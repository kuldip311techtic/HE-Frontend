import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../lib/api/client';
import { getApiErrorMessage } from '../lib/api/errors';
import { queryKeys } from '../lib/api/queryKeys';
import type { User, UserAddPayload } from '../types/user';

async function addUserRequest(payload: UserAddPayload): Promise<User> {
  const { data } = await apiClient.post<User>('/users', payload);

  return data;
}

export function useAddUser() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: addUserRequest,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.users.all,
      });
    },
  });

  return {
    addUser: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    errorMessage: mutation.error
      ? getApiErrorMessage(
          mutation.error,
          'Unable to add user. Please try again.',
        )
      : null,
    reset: mutation.reset,
  };
}
