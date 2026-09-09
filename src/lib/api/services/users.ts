import { apiRequest } from '@/lib/api/request';
import { endpoints } from '@/lib/api/endpoints';
import type {
  AdminUserCreateRequest,
  AdminUserDeleteResponse,
  AdminUserListParams,
  AdminUserListResponse,
  AdminUserMutationResponse,
  AdminUserUpdateRequest,
} from '@/types/user';

export async function listUsers(params: AdminUserListParams): Promise<AdminUserListResponse> {
  return apiRequest<AdminUserListResponse>(endpoints.usersList, { params });
}

export async function createUser(payload: AdminUserCreateRequest): Promise<AdminUserMutationResponse> {
  return apiRequest<AdminUserMutationResponse>(endpoints.usersCreate, { data: payload });
}

export async function updateUser(
  userId: string,
  payload: AdminUserUpdateRequest,
): Promise<AdminUserMutationResponse> {
  return apiRequest<AdminUserMutationResponse>(endpoints.usersUpdate, {
    pathParams: { user_id: userId },
    data: payload,
  });
}

export async function deleteUser(userId: string): Promise<AdminUserDeleteResponse> {
  return apiRequest<AdminUserDeleteResponse>(endpoints.usersDelete, {
    pathParams: { user_id: userId },
  });
}
