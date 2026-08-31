import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createUser,
  deleteUser,
  listUsers,
  updateUser,
} from '@/services/users'
import type {
  CreateUserRequest,
  UpdateUserRequest,
  User,
  UsersListResponse,
} from '@/types/api'

const USERS_QUERY_KEY = 'super-admin-users'

export function useUsers(page: number) {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: [USERS_QUERY_KEY, page],
    queryFn: () => listUsers(page),
  })

  const createMutation = useMutation({
    mutationFn: (data: CreateUserRequest) => createUser(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserRequest }) =>
      updateUser(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] })
    },
  })

  return {
    users: query.data?.items ?? [],
    pagination: query.data?.pagination,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    createUser: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    createError: createMutation.error,
    updateUser: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,
    deleteUser: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    deleteError: deleteMutation.error,
  }
}

export type { User, UsersListResponse }
