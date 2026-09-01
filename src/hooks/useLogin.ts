import { useMutation } from '@tanstack/react-query'
import { login } from '@/services/auth'
import type { LoginRequest } from '@/types/auth'
import { ApiError } from '@/types/api'

export const LOGIN_QUERY_KEY = ['super-admin', 'login'] as const

export function useLogin() {
  return useMutation({
    mutationKey: LOGIN_QUERY_KEY,
    mutationFn: (credentials: LoginRequest) => login(credentials),
  })
}

export function getLoginErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message
  }
  if (error instanceof Error) {
    return error.message
  }
  return 'An unexpected error occurred. Please try again.'
}
