import { useNavigate } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'

import { loginSuperAdmin } from '@/services/super-admin'
import type { LoginRequest } from '@/types/super-admin'

export function useLogin() {
  const navigate = useNavigate()

  return useMutation({
    mutationKey: ['super-admin', 'login'],
    mutationFn: (credentials: LoginRequest) => loginSuperAdmin(credentials),
    onSuccess: () => {
      void navigate({ to: '/super-admin/dashboard' })
    },
  })
}
