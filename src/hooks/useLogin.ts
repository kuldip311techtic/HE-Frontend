import { useCallback, useState } from 'react'
import { login as loginRequest } from '@/services/auth'
import { ApiError } from '@/types/api'

interface LoginCredentials {
  email: string
  password: string
}

interface UseLoginResult {
  login: (credentials: LoginCredentials) => Promise<boolean>
  isLoading: boolean
  error: string | null
  isSuccess: boolean
  clearError: () => void
}

export function useLogin(): UseLoginResult {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    setIsLoading(true)
    setError(null)
    setIsSuccess(false)

    try {
      await loginRequest(credentials)
      setIsSuccess(true)
      return true
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Unable to sign in. Please try again.')
      }
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    login,
    isLoading,
    error,
    isSuccess,
    clearError,
  }
}
