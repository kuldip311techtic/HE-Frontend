import { setAuthToken } from '@/lib/auth'
import { apiRequest } from '@/services/api-client'
import type { LoginRequest, LoginResponse } from '@/types/api'

export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  const response = await apiRequest<LoginResponse>('/api/super-admin/login', {
    method: 'POST',
    body: credentials,
  })
  setAuthToken(response.token)
  return response
}
