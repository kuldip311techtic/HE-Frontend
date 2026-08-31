import { apiRequest, unwrapListEnvelope } from '@/services/api-client';
import type {
  CreateUserRequest,
  DeleteUserResponse,
  UpdateUserRequest,
  UserMutationResponse,
  UsersListResponse,
} from '@/types';

const USERS_PATH = '/api/v1/super-admin/users';
const USER_BY_ID_PATH = '/api/v1/super-admin/users/{user_id}';
const USERS_LIST_UNWRAP_KEY = 'items' as const;

export interface ListUsersParams {
  page?: number;
  page_size?: number;
}

function resolveUserByIdPath(user_id: string): string {
  return USER_BY_ID_PATH.replace('{user_id}', user_id);
}

export async function listSuperAdminUsers(
  params: ListUsersParams = {},
): Promise<UsersListResponse> {
  const searchParams = new URLSearchParams();
  if (params.page !== undefined) {
    searchParams.set('page', String(params.page));
  }
  if (params.page_size !== undefined) {
    searchParams.set('page_size', String(params.page_size));
  }
  const query = searchParams.toString();
  const path = query ? `${USERS_PATH}?${query}` : USERS_PATH;
  const body = await apiRequest<unknown>(path, { method: 'GET' });
  return unwrapListEnvelope<UsersListResponse>(body, USERS_LIST_UNWRAP_KEY);
}

export async function createSuperAdminUser(
  payload: CreateUserRequest,
): Promise<UserMutationResponse> {
  return apiRequest<UserMutationResponse>(USERS_PATH, {
    method: 'POST',
    body: payload,
  });
}

export async function updateSuperAdminUser(
  user_id: string,
  payload: UpdateUserRequest,
): Promise<UserMutationResponse> {
  return apiRequest<UserMutationResponse>(resolveUserByIdPath(user_id), {
    method: 'PUT',
    body: payload,
  });
}

export async function deleteSuperAdminUser(user_id: string): Promise<DeleteUserResponse> {
  return apiRequest<DeleteUserResponse>(resolveUserByIdPath(user_id), {
    method: 'DELETE',
  });
}

export { USERS_PATH, USER_BY_ID_PATH, USERS_LIST_UNWRAP_KEY };
