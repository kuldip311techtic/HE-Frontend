import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  createAdminUser,
  deleteAdminUser,
  updateAdminUser,
} from '@/lib/api/users';
import type { AdminUserCreateRequest, AdminUserUpdateRequest } from '@/types/api';

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: AdminUserCreateRequest) => createAdminUser(body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['super-admin', 'users'] });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, body }: { userId: string; body: AdminUserUpdateRequest }) =>
      updateAdminUser(userId, body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['super-admin', 'users'] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => deleteAdminUser(userId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['super-admin', 'users'] });
    },
  });
}
