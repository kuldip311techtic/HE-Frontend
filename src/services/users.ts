import {
  apiClient,
  toClientPath,
  unwrapListResponse,
} from "@/services/api-client";
import type {
  CreateUserRequest,
  DeleteUserResponse,
  ListUsersResponse,
  UpdateUserRequest,
  UserMutationResponse,
} from "@/types/users";

const SUPER_ADMIN_USERS_PATH = "/api/v1/super-admin/users";

export async function listUsers(page = 1, pageSize = 20): Promise<ListUsersResponse> {
  const params = new URLSearchParams({
    page: String(page),
    page_size: String(pageSize),
  });
  const response = await apiClient<unknown>(
    `${toClientPath(SUPER_ADMIN_USERS_PATH)}?${params.toString()}`
  );
  return unwrapListResponse<ListUsersResponse>(response, "items");
}

export async function createUser(data: CreateUserRequest): Promise<UserMutationResponse> {
  return apiClient<UserMutationResponse>(toClientPath(SUPER_ADMIN_USERS_PATH), {
    method: "POST",
    body: data,
  });
}

export async function updateUser(
  userId: string,
  data: UpdateUserRequest
): Promise<UserMutationResponse> {
  return apiClient<UserMutationResponse>(
    toClientPath(`/api/v1/super-admin/users/${userId}`),
    {
      method: "PUT",
      body: data,
    }
  );
}

export async function deleteUser(userId: string): Promise<DeleteUserResponse> {
  return apiClient<DeleteUserResponse>(
    toClientPath(`/api/v1/super-admin/users/${userId}`),
    {
      method: "DELETE",
    }
  );
}
