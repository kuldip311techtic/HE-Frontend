import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  createSuperAdminUser,
  deleteSuperAdminUser,
  listSuperAdminUsers,
  updateSuperAdminUser,
  USERS_PATH,
} from '@/services/users';
import { ApiClientError } from '@/services/api-client';
import type {
  CreateUserRequest,
  SuperAdminUserRecord,
  UpdateUserRequest,
  UserRoleOption,
} from '@/types';

export const USERS_QUERY_KEY = 'super-admin-users';

const DEFAULT_PAGE_SIZE = 10;

interface UseUsersOptions {
  page?: number;
  pageSize?: number;
}

export function useUsers({ page = 1, pageSize = DEFAULT_PAGE_SIZE }: UseUsersOptions = {}) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [USERS_QUERY_KEY, page, pageSize],
    queryFn: () => listSuperAdminUsers({ page, page_size: pageSize }),
  });

  const invalidateUsers = () => {
    void queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
  };

  const createMutation = useMutation({
    mutationFn: (payload: CreateUserRequest) => createSuperAdminUser(payload),
    onSuccess: (data) => {
      toast.success(data.message || 'User created successfully.');
      invalidateUsers();
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create user.');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ userId, payload }: { userId: string; payload: UpdateUserRequest }) =>
      updateSuperAdminUser(userId, payload),
    onSuccess: (data) => {
      toast.success(data.message || 'User updated successfully.');
      invalidateUsers();
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update user.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (userId: string) => deleteSuperAdminUser(userId),
    onSuccess: (data) => {
      toast.success(data.message || 'User removed successfully.');
      invalidateUsers();
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to remove user.');
    },
  });

  return {
    users: query.data?.items ?? [],
    pagination: query.data?.pagination,
    roles: query.data?.roles ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    createUser: createMutation.mutateAsync,
    updateUser: updateMutation.mutateAsync,
    deleteUser: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}

export function getFieldError(
  error: unknown,
  field: string,
): string | undefined {
  if (!(error instanceof ApiClientError)) {
    return undefined;
  }
  return error.details?.find((detail) => detail.field === field)?.message;
}

export function filterManageableRoles(roles: UserRoleOption[]): UserRoleOption[] {
  return roles.filter((role) => {
    const value = role.value.toLowerCase();
    return value === 'coach' || value === 'player';
  });
}

export function getDefaultRoles(): UserRoleOption[] {
  return [
    { value: 'coach', label: 'Coach', description: 'Coaching staff member' },
    { value: 'player', label: 'Player', description: 'Player account' },
  ];
}

export type { SuperAdminUserRecord };
export { USERS_PATH, DEFAULT_PAGE_SIZE };
