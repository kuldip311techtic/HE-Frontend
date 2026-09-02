import { apiRequest, unwrapList } from "@/services/api-client";
import type {
  CreateUserRequest,
  PaginatedUsersResponse,
  SuperAdminUser,
  UpdateUserRequest,
} from "@/types/super-admin";

export interface ListUsersParams {
  page?: number;
  page_size?: number;
}

export async function listUsers(
  params: ListUsersParams = {}
): Promise<PaginatedUsersResponse> {
  const searchParams = new URLSearchParams();
  if (params.page !== undefined) {
    searchParams.set("page", String(params.page));
  }
  if (params.page_size !== undefined) {
    searchParams.set("page_size", String(params.page_size));
  }
  const query = searchParams.toString();
  const path = query
    ? `/api/v1/super-admin/users?${query}`
    : "/api/v1/super-admin/users";

  return apiRequest<PaginatedUsersResponse>(path, {
    method: "GET",
  });
}

export async function getUsersList(): Promise<SuperAdminUser[]> {
  const response = await listUsers();
  return unwrapList<SuperAdminUser>(
    response as unknown as Record<string, unknown>,
    "items"
  );
}

export async function createUser(
  data: CreateUserRequest
): Promise<SuperAdminUser> {
  return apiRequest<SuperAdminUser>("/api/v1/super-admin/users", {
    method: "POST",
    body: data,
  });
}

export async function updateUser(
  userId: string,
  data: UpdateUserRequest
): Promise<SuperAdminUser> {
  return apiRequest<SuperAdminUser>(
    `/api/v1/super-admin/users/${userId}`,
    {
      method: "PUT",
      body: data,
    }
  );
}

export async function deleteUser(userId: string): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(
    `/api/v1/super-admin/users/${userId}`,
    {
      method: "DELETE",
    }
  );
}
