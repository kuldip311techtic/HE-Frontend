import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { USERS_QUERY_KEY } from '@/hooks/users-query-keys'
import { ApiError } from '@/services/api-client'
import { updateSuperAdminUser } from '@/services/super-admin'
import type { UpdateUserRequest } from '@/types/super-admin'

interface UpdateUserVariables {
  userId: string
  payload: UpdateUserRequest
}

function getMutationErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiError) {
    const emailDetail = error.details.find((d) => d.field === 'email')
    if (emailDetail) return emailDetail.message
    return error.message
  }
  if (error instanceof Error) return error.message
  return fallback
}

export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, payload }: UpdateUserVariables) =>
      updateSuperAdminUser(userId, payload),
    onSuccess: (data) => {
      toast.success(data.message || 'User updated successfully')
      void queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY })
    },
    onError: (error) => {
      toast.error(getMutationErrorMessage(error, 'Failed to update user'))
    },
  })
}
