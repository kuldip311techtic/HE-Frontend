import { apiClient, unwrapList } from '@/services/api-client'
import { setAuthToken } from '@/lib/auth'
import type {
  CreateUserRequest,
  DeleteUserResponse,
  ListUsersParams,
  ListUsersResponse,
  LoginRequest,
  LoginResponse,
  SuperAdminDashboardResponse,
  SuperAdminUser,
  UpdateUserRequest,
  UserMutationResponse,
} from '@/types/super-admin'

const ENDPOINTS = {
  login: '/api/super-admin/login',
  users: '/api/v1/super-admin/users',
  userById: (userId: string) => `/api/v1/super-admin/users/${userId}`,
  dashboard: '/api/v1/super-admin/dashboard',
} as const

export async function loginSuperAdmin(
  credentials: LoginRequest,
): Promise<string> {
  const response = await apiClient<LoginResponse>(ENDPOINTS.login, {
    method: 'POST',
    body: credentials,
    auth: false,
  })

  const token = response.token ?? response.access_token
  if (!token) {
    throw new Error('Login succeeded but no token was returned')
  }

  setAuthToken(token)
  return token
}

export async function listSuperAdminUsers(
  params?: ListUsersParams,
): Promise<ListUsersResponse> {
  const searchParams = new URLSearchParams()
  if (params?.page !== undefined) {
    searchParams.set('page', String(params.page))
  }
  if (params?.page_size !== undefined) {
    searchParams.set('page_size', String(params.page_size))
  }
  const query = searchParams.toString()
  const path = query ? `${ENDPOINTS.users}?${query}` : ENDPOINTS.users

  const response = await apiClient<ListUsersResponse | SuperAdminUser[]>(
    path,
    { method: 'GET' },
  )

  if (Array.isArray(response)) {
    return {
      items: response,
      pagination: {
        page: 1,
        page_size: response.length,
        total: response.length,
        total_pages: 1,
        has_next: false,
        has_prev: false,
      },
    }
  }

  return {
    ...response,
    items: unwrapList<SuperAdminUser>(response, 'items'),
  }
}

export async function createSuperAdminUser(
  payload: CreateUserRequest,
): Promise<UserMutationResponse> {
  return apiClient<UserMutationResponse>(ENDPOINTS.users, {
    method: 'POST',
    body: payload,
  })
}

export async function updateSuperAdminUser(
  userId: string,
  payload: UpdateUserRequest,
): Promise<UserMutationResponse> {
  return apiClient<UserMutationResponse>(ENDPOINTS.userById(userId), {
    method: 'PUT',
    body: payload,
  })
}

export async function deleteSuperAdminUser(
  userId: string,
): Promise<DeleteUserResponse> {
  return apiClient<DeleteUserResponse>(ENDPOINTS.userById(userId), {
    method: 'DELETE',
  })
}

export async function getSuperAdminDashboard(): Promise<SuperAdminDashboardResponse> {
  return apiClient<SuperAdminDashboardResponse>(ENDPOINTS.dashboard, {
    method: 'GET',
  })
}

export { ENDPOINTS as superAdminEndpoints }
