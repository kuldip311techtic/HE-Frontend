import { apiRequest } from '@/services/api-client'
import type {
  CreateUserRequest,
  CreateUserResponse,
  UpdateUserRequest,
  UsersListResponse,
} from '@/types/api'

const USERS_PAGE_SIZE = 10

export async function listUsers(page = 1): Promise<UsersListResponse> {
  return apiRequest<UsersListResponse>(
    `/super-admin/users?page=${page}&limit=${USERS_PAGE_SIZE}`,
    {
      method: 'GET',
      auth: true,
    },
  )
}

export async function createUser(
  data: CreateUserRequest,
): Promise<CreateUserResponse> {
  return apiRequest<CreateUserResponse>('/super-admin/users', {
    method: 'POST',
    body: data,
    auth: true,
  })
}

export async function updateUser(
  id: string,
  data: UpdateUserRequest,
): Promise<void> {
  await apiRequest<void>(`/api/super-admin/users/${id}`, {
    method: 'PUT',
    body: data,
    auth: true,
  })
}

export async function deleteUser(id: string): Promise<void> {
  await apiRequest<void>(`/api/super-admin/users/${id}`, {
    method: 'DELETE',
    auth: true,
  })
}

export { USERS_PAGE_SIZE }
