import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  createUser,
  deleteUser,
  listUsers,
  updateUser,
} from '@/services/users'
import { ApiError } from '@/types/api'
import type {
  CreateUserRequest,
  SuperAdminUser,
  UpdateUserRequest,
} from '@/types/users'
import { getFieldErrorMessage } from '@/lib/user-helpers'

export const USERS_QUERY_KEY = ['super-admin', 'users'] as const

const DEFAULT_PAGE_SIZE = 10

export function useUsers(page = 1, pageSize = DEFAULT_PAGE_SIZE) {
  return useQuery({
    queryKey: [...USERS_QUERY_KEY, page, pageSize],
    queryFn: () => listUsers({ page, page_size: pageSize }),
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateUserRequest) => createUser(data),
    onSuccess: (response) => {
      toast.success(response.message || 'User created successfully.')
      void queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY })
    },
    onError: (error: Error) => {
      if (error instanceof ApiError) {
        const emailError = getFieldErrorMessage(error.details, 'email')
        toast.error(emailError ?? error.message)
        return
      }
      toast.error('Failed to create user. Please try again.')
    },
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      userId,
      data,
    }: {
      userId: string
      data: UpdateUserRequest
    }) => updateUser(userId, data),
    onSuccess: (response) => {
      toast.success(response.message || 'User updated successfully.')
      void queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY })
    },
    onError: (error: Error) => {
      if (error instanceof ApiError) {
        const emailError = getFieldErrorMessage(error.details, 'email')
        toast.error(emailError ?? error.message)
        return
      }
      toast.error('Failed to update user. Please try again.')
    },
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userId: string) => deleteUser(userId),
    onSuccess: (response) => {
      toast.success(response.message || 'User removed successfully.')
      void queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY })
    },
    onError: (error: Error) => {
      if (error instanceof ApiError) {
        toast.error(error.message)
        return
      }
      toast.error('Failed to remove user. Please try again.')
    },
  })
}

export type { SuperAdminUser }
