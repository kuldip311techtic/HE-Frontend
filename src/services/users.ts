import { apiClient, unwrapListResponse } from '@/lib/api-client'
import type {
  CreateUserRequest,
  DeleteUserResponse,
  ListUsersResponse,
  UpdateUserRequest,
  UserMutationResponse,
} from '@/types/users'

const USERS_PATH = '/api/v1/super-admin/users'
const USER_BY_ID_PATH = '/api/v1/super-admin/users/{user_id}'
const USERS_LIST_UNWRAP_KEY = 'items' as const

function resolveUserByIdPath(user_id: string): string {
  return USER_BY_ID_PATH.replace('{user_id}', user_id)
}

export async function listUsers(params?: {
  page?: number
  page_size?: number
}): Promise<ListUsersResponse> {
  const searchParams = new URLSearchParams()
  if (params?.page) searchParams.set('page', String(params.page))
  if (params?.page_size) searchParams.set('page_size', String(params.page_size))

  const query = searchParams.toString()
  const path = query ? `${USERS_PATH}?${query}` : USERS_PATH

  const body = await apiClient<unknown>(path, { method: 'GET' })
  return unwrapListResponse<ListUsersResponse>(body, USERS_LIST_UNWRAP_KEY)
}

export async function createUser(
  data: CreateUserRequest,
): Promise<UserMutationResponse> {
  return apiClient<UserMutationResponse>(USERS_PATH, {
    method: 'POST',
    body: data,
  })
}

export async function updateUser(
  user_id: string,
  data: UpdateUserRequest,
): Promise<UserMutationResponse> {
  return apiClient<UserMutationResponse>(resolveUserByIdPath(user_id), {
    method: 'PUT',
    body: data,
  })
}

export async function deleteUser(user_id: string): Promise<DeleteUserResponse> {
  return apiClient<DeleteUserResponse>(resolveUserByIdPath(user_id), {
    method: 'DELETE',
  })
}

export const usersService = {
  listUsers,
  createUser,
  updateUser,
  deleteUser,
}
