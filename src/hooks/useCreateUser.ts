import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { USERS_QUERY_KEY } from '@/hooks/users-query-keys'
import { ApiError } from '@/services/api-client'
import { createSuperAdminUser } from '@/services/super-admin'
import type { CreateUserRequest } from '@/types/super-admin'

function getMutationErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiError) {
    const emailDetail = error.details.find((d) => d.field === 'email')
    if (emailDetail) return emailDetail.message
    return error.message
  }
  if (error instanceof Error) return error.message
  return fallback
}

export function useCreateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateUserRequest) => createSuperAdminUser(payload),
    onSuccess: (data) => {
      toast.success(data.message || 'User created successfully')
      void queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY })
    },
    onError: (error) => {
      toast.error(getMutationErrorMessage(error, 'Failed to create user'))
    },
  })
}
