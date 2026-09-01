import { apiClient } from '@/lib/api-client'
import { setAuthToken } from '@/lib/auth-storage'
import type {
  LoginRequest,
  LoginResponse,
  SuperAdminDashboardResponse,
} from '@/types/auth'

const LOGIN_PATH = '/api/super-admin/login'
const DASHBOARD_PATH = '/api/v1/super-admin/dashboard'

export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  const response = await apiClient<LoginResponse>(LOGIN_PATH, {
    method: 'POST',
    body: credentials,
    auth: false,
  })

  const token = response.token ?? response.access_token
  if (token) {
    setAuthToken(token)
  }

  return response
}

export async function getDashboard(): Promise<SuperAdminDashboardResponse> {
  return apiClient<SuperAdminDashboardResponse>(DASHBOARD_PATH, {
    method: 'GET',
  })
}

export const authService = {
  login,
  getDashboard,
}
