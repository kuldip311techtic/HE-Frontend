import { apiClient, resolveApiPath } from '@/lib/api/client';
import { endpoints, withPathParam } from '@/lib/api/endpoints';
import type {
  SuperAdminUserCreateRequest,
  SuperAdminUserListResponse,
  SuperAdminUserMutationResponse,
  SuperAdminUserUpdateRequest,
} from '@/types/user';

export interface FetchUsersParams {
  page?: number;
  limit?: number;
}

export async function fetchUsers(params: FetchUsersParams = {}): Promise<SuperAdminUserListResponse> {
  const { method, path } = endpoints.users.list;
  const { data } = await apiClient.request<SuperAdminUserListResponse>({
    method,
    url: resolveApiPath(path),
    params: {
      page: params.page ?? 1,
      limit: params.limit ?? 20,
    },
  });
  return data;
}

export async function createUser(
  payload: SuperAdminUserCreateRequest,
): Promise<SuperAdminUserMutationResponse> {
  const { method, path } = endpoints.users.create;
  const { data } = await apiClient.request<SuperAdminUserMutationResponse>({
    method,
    url: resolveApiPath(path),
    data: payload,
  });
  return data;
}

export async function updateUser(
  id: string,
  payload: SuperAdminUserUpdateRequest,
): Promise<SuperAdminUserMutationResponse> {
  const { method, path } = endpoints.users.update;
  const { data } = await apiClient.request<SuperAdminUserMutationResponse>({
    method,
    url: resolveApiPath(withPathParam(path, id)),
    data: payload,
  });
  return data;
}

export async function deleteUser(id: string): Promise<{ message: string }> {
  const { method, path } = endpoints.users.delete;
  const { data } = await apiClient.request<{ message: string }>({
    method,
    url: resolveApiPath(withPathParam(path, id)),
  });
  return data;
}
