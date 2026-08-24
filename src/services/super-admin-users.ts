import { apiRequest } from "@/services/api-client";
import type {
  CreateUserRequest,
  UpdateUserRequest,
  UserListData,
  UserListParams,
  UserListResponse,
  UserMutationResponse,
} from "@/types/user";

const SUPER_ADMIN_USERS_PATH = "/api/super-admin/users";

function buildUsersPath(params: UserListParams = {}): string {
  const searchParams = new URLSearchParams();

  if (params.page !== undefined) {
    searchParams.set("page", String(params.page));
  }

  if (params.limit !== undefined) {
    searchParams.set("limit", String(params.limit));
  }

  const query = searchParams.toString();
  return query ? `${SUPER_ADMIN_USERS_PATH}?${query}` : SUPER_ADMIN_USERS_PATH;
}

export async function fetchUsers(
  params: UserListParams = {},
): Promise<UserListData> {
  const response = await apiRequest<UserListResponse>(buildUsersPath(params), {
    method: "GET",
    auth: true,
  });

  return response.data;
}

export async function createUser(
  payload: CreateUserRequest,
): Promise<UserMutationResponse> {
  return apiRequest<UserMutationResponse>(SUPER_ADMIN_USERS_PATH, {
    method: "POST",
    body: payload,
    auth: true,
  });
}

export async function updateUser(
  id: string,
  payload: UpdateUserRequest,
): Promise<UserMutationResponse> {
  return apiRequest<UserMutationResponse>(
    `${SUPER_ADMIN_USERS_PATH}/${id}`,
    {
      method: "PUT",
      body: payload,
      auth: true,
    },
  );
}

export async function deleteUser(id: string): Promise<UserMutationResponse> {
  return apiRequest<UserMutationResponse>(
    `${SUPER_ADMIN_USERS_PATH}/${id}`,
    {
      method: "DELETE",
      auth: true,
    },
  );
}
