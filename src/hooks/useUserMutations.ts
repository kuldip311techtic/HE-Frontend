import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createUser, deleteUser, updateUser } from '@/lib/api/users';
import type { UserCreateRequest, UserUpdateRequest } from '@/types/users';

export function useUserMutations() {
  const queryClient = useQueryClient();

  const invalidateList = async () => {
    await queryClient.invalidateQueries({
      queryKey: ['super-admin', 'users'],
    });
  };

  const create = useMutation({
    mutationFn: (payload: UserCreateRequest) => createUser(payload),
    onSuccess: async (response) => {
      await invalidateList();
      toast.success(response.message || 'User created successfully.');
    },
  });

  const update = useMutation({
    mutationFn: ({ userId, payload }: { userId: string; payload: UserUpdateRequest }) =>
      updateUser(userId, payload),
    onSuccess: async (response) => {
      await invalidateList();
      toast.success(response.message || 'User updated successfully.');
    },
  });

  const remove = useMutation({
    mutationFn: (userId: string) => deleteUser(userId),
    onSuccess: async (response) => {
      await invalidateList();
      toast.success(response.message || 'User removed successfully.');
    },
  });

  return { create, update, remove };
}
