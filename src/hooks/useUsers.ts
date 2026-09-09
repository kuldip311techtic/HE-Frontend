import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/api/queryKeys';
import {
  createUser,
  deleteUser,
  fetchUsers,
  updateUser,
} from '@/lib/api/services/users';
import type {
  SuperAdminUserCreateRequest,
  SuperAdminUserUpdateRequest,
} from '@/types/user';

export interface UseUsersListParams {
  page: number;
  limit: number;
}

export function useUsersList({ page, limit }: UseUsersListParams) {
  return useQuery({
    queryKey: queryKeys.users.list(page, limit),
    queryFn: () => fetchUsers({ page, limit }),
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SuperAdminUserCreateRequest) => createUser(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: SuperAdminUserUpdateRequest }) =>
      updateUser(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
}
