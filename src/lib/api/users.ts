import type {
  UserCreateRequest,
  UserDeleteResponse,
  UserItem,
  UserListParams,
  UserListResponse,
  UserMutationResponse,
  UserUpdateRequest,
} from '@/types/users';
import { apiClient } from './client';
import {
  CONTRACT_ROUTES,
  contractPathToClientPath,
  contractPathWithParams,
} from './endpoints';
import { normalizePaginatedListResponse } from './normalize-list-response';

const listRoute = CONTRACT_ROUTES.superAdminUsers;
const createRoute = CONTRACT_ROUTES.superAdminUsersCreate;

/** Live list filter accepts coach | player | org_admin | super_admin, not UI labels. */
function toApiRoleFilter(role: string): string {
  return role.trim().toLowerCase().replace(/\s+/g, '_');
}

function toApiRolePayload(role: string): string {
  return toApiRoleFilter(role);
}

/** GET /api/v1/super-admin/users */
export async function fetchUsers(params: UserListParams): Promise<UserListResponse> {
  const { data } = await apiClient.request<unknown>({
    method: listRoute.method,
    url: contractPathToClientPath(listRoute.path),
    params: {
      page: params.page ?? 1,
      page_size: params.page_size ?? 10,
      ...(params.search?.trim() ? { search: params.search.trim() } : {}),
      ...(params.role?.trim() ? { role: toApiRoleFilter(params.role) } : {}),
    },
  });
  return normalizePaginatedListResponse<UserItem>(
    data,
    listRoute.listUnwrapKey,
    params.page ?? 1,
    params.page_size ?? 10,
  );
}

/** POST /api/v1/super-admin/users */
export async function createUser(payload: UserCreateRequest): Promise<UserMutationResponse> {
  const { data } = await apiClient.request<UserMutationResponse>({
    method: createRoute.method,
    url: contractPathToClientPath(createRoute.path),
    data: {
      ...payload,
      role: toApiRolePayload(payload.role),
    },
  });
  return data;
}

/** PUT /api/v1/super-admin/users/{user_id} */
export async function updateUser(
  userId: string,
  payload: UserUpdateRequest,
): Promise<UserMutationResponse> {
  const contractPath = contractPathWithParams(CONTRACT_ROUTES.superAdminUserDetail.path, {
    user_id: userId,
  });
  const { data } = await apiClient.request<UserMutationResponse>({
    method: 'PUT',
    url: contractPathToClientPath(contractPath),
    data: {
      ...payload,
      ...(payload.role ? { role: toApiRolePayload(payload.role) } : {}),
    },
  });
  return data;
}

/** DELETE /api/v1/super-admin/users/{user_id} */
export async function deleteUser(userId: string): Promise<UserDeleteResponse> {
  const contractPath = contractPathWithParams(CONTRACT_ROUTES.superAdminUserDetail.path, {
    user_id: userId,
  });
  const { data } = await apiClient.request<UserDeleteResponse>({
    method: 'DELETE',
    url: contractPathToClientPath(contractPath),
  });
  return data;
}
