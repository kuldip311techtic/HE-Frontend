import { apiRequest, unwrapListResponse } from "@/services/api-client";
import type {
  CreateUserRequest,
  UpdateUserRequest,
  User,
  UserListData,
  UserListParams,
  UserMutationResponse,
  UserPagination,
} from "@/types/user";

const SUPER_ADMIN_USERS_PATH = "/api/v1/super-admin/users";
const USER_BY_ID_PATH = "/api/v1/super-admin/users/{user_id}";
const USERS_LIST_UNWRAP_KEY = "items" as const;

function resolveUserByIdPath(user_id: string): string {
  return USER_BY_ID_PATH.replace("{user_id}", user_id);
}

function buildUsersPath(params: UserListParams = {}): string {
  const searchParams = new URLSearchParams();

  if (params.page !== undefined) {
    searchParams.set("page", String(params.page));
  }

  if (params.page_size !== undefined) {
    searchParams.set("page_size", String(params.page_size));
  }

  const query = searchParams.toString();
  return query ? `${SUPER_ADMIN_USERS_PATH}?${query}` : SUPER_ADMIN_USERS_PATH;
}

function buildPagination(
  items: User[],
  raw: Record<string, unknown>,
): UserPagination {
  const pagination = raw.pagination as UserPagination | undefined;

  if (pagination) {
    return pagination;
  }

  const page = typeof raw.page === "number" ? raw.page : 1;
  const pageSize =
    typeof raw.page_size === "number"
      ? raw.page_size
      : typeof raw.limit === "number"
        ? raw.limit
        : items.length || 10;
  const total =
    typeof raw.total === "number" ? raw.total : items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return {
    page,
    page_size: pageSize,
    total,
    total_pages: totalPages,
    has_next: page < totalPages,
    has_prev: page > 1,
  };
}

function normalizeUserListData(raw: Record<string, unknown>): UserListData {
  const items = Array.isArray(raw.items) ? (raw.items as User[]) : [];

  return {
    items,
    pagination: buildPagination(items, raw),
  };
}

export async function fetchUsers(
  params: UserListParams = {},
): Promise<UserListData> {
  const response = await apiRequest<unknown>(buildUsersPath(params), {
    method: "GET",
    auth: true,
  });

  const unwrapped = unwrapListResponse<Record<string, unknown>>(
    response,
    USERS_LIST_UNWRAP_KEY,
  );

  return normalizeUserListData(unwrapped);
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
  user_id: string,
  payload: UpdateUserRequest,
): Promise<UserMutationResponse> {
  return apiRequest<UserMutationResponse>(resolveUserByIdPath(user_id), {
    method: "PUT",
    body: payload,
    auth: true,
  });
}

export async function deleteUser(
  user_id: string,
): Promise<UserMutationResponse> {
  return apiRequest<UserMutationResponse>(resolveUserByIdPath(user_id), {
    method: "DELETE",
    auth: true,
  });
}
