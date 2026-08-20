import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../lib/api/client';
import { getApiErrorMessage } from '../lib/api/errors';
import { queryKeys } from '../lib/api/queryKeys';
import type { User, UserEditPayload } from '../types/user';

interface EditUserVariables {
  id: string;
  payload: UserEditPayload;
}

async function editUserRequest({
  id,
  payload,
}: EditUserVariables): Promise<User> {
  const { data } = await apiClient.put<User>(`/users/${id}`, payload);

  return data;
}

export function useEditUser() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: editUserRequest,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.users.all,
      });
    },
  });

  return {
    editUser: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    errorMessage: mutation.error
      ? getApiErrorMessage(
          mutation.error,
          'Unable to save user changes. Please try again.',
        )
      : null,
    reset: mutation.reset,
  };
}
