import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { USERS_QUERY_KEY } from '@/hooks/users-query-keys'
import { ApiError } from '@/services/api-client'
import { deleteSuperAdminUser } from '@/services/super-admin'

function getMutationErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiError) return error.message
  if (error instanceof Error) return error.message
  return fallback
}

export function useDeleteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userId: string) => deleteSuperAdminUser(userId),
    onSuccess: (data) => {
      toast.success(data.message || 'User removed successfully')
      void queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY })
    },
    onError: (error) => {
      toast.error(getMutationErrorMessage(error, 'Failed to remove user'))
    },
  })
}
