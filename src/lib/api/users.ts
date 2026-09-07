import type { PaginationMeta } from '@/types/api';
import type {
  UserCreateRequest,
  UserDeleteResponse,
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
  unwrapListResponse,
} from './endpoints';

const listRoute = CONTRACT_ROUTES.superAdminUsers;
const createRoute = CONTRACT_ROUTES.superAdminUsersCreate;

function normalizePagination(
  partial: Partial<PaginationMeta> | undefined,
  fallbackPage: number,
  fallbackPageSize: number,
): PaginationMeta {
  const page = partial?.page ?? fallbackPage;
  const page_size = partial?.page_size ?? fallbackPageSize;
  const total = partial?.total ?? 0;
  const total_pages =
    partial?.total_pages ?? (page_size > 0 ? Math.ceil(total / page_size) : 0);
  const has_next = partial?.has_next ?? page < total_pages;
  const has_prev = partial?.has_prev ?? page > 1;

  return { page, page_size, total, total_pages, has_next, has_prev };
}

function normalizeListResponse(
  body: unknown,
  fallbackPage: number,
  fallbackPageSize: number,
): UserListResponse {
  const unwrapped = unwrapListResponse<UserListResponse | UserListResponse['items']>(
    body,
    listRoute.listUnwrapKey,
  );

  if (Array.isArray(unwrapped)) {
    return {
      items: unwrapped,
      pagination: normalizePagination(
        {
          page: fallbackPage,
          page_size: fallbackPageSize,
          total: unwrapped.length,
          total_pages: 1,
          has_next: false,
          has_prev: false,
        },
        fallbackPage,
        fallbackPageSize,
      ),
    };
  }

  if (
    unwrapped &&
    typeof unwrapped === 'object' &&
    'items' in unwrapped &&
    Array.isArray((unwrapped as UserListResponse).items)
  ) {
    const response = unwrapped as UserListResponse;
    return {
      items: response.items,
      pagination: normalizePagination(response.pagination, fallbackPage, fallbackPageSize),
    };
  }

  return {
    items: [],
    pagination: normalizePagination(undefined, fallbackPage, fallbackPageSize),
  };
}

/** GET /api/super-admin/users */
export async function fetchUsers(params: UserListParams): Promise<UserListResponse> {
  const { data } = await apiClient.request<unknown>({
    method: listRoute.method,
    url: contractPathToClientPath(listRoute.path),
    params: {
      page: params.page ?? 1,
      page_size: params.page_size ?? 10,
      ...(params.search?.trim() ? { search: params.search.trim() } : {}),
      ...(params.role?.trim() ? { role: params.role.trim() } : {}),
    },
  });
  return normalizeListResponse(data, params.page ?? 1, params.page_size ?? 10);
}

/** POST /api/super-admin/users */
export async function createUser(payload: UserCreateRequest): Promise<UserMutationResponse> {
  const { data } = await apiClient.request<UserMutationResponse>({
    method: createRoute.method,
    url: contractPathToClientPath(createRoute.path),
    data: payload,
  });
  return data;
}

/** PUT /api/super-admin/users/{id} */
export async function updateUser(
  userId: string,
  payload: UserUpdateRequest,
): Promise<UserMutationResponse> {
  const contractPath = contractPathWithParams(CONTRACT_ROUTES.superAdminUserDetail.path, {
    id: userId,
  });
  const { data } = await apiClient.request<UserMutationResponse>({
    method: 'PUT',
    url: contractPathToClientPath(contractPath),
    data: payload,
  });
  return data;
}

/** DELETE /api/super-admin/users/{id} */
export async function deleteUser(userId: string): Promise<UserDeleteResponse> {
  const contractPath = contractPathWithParams(CONTRACT_ROUTES.superAdminUserDetail.path, {
    id: userId,
  });
  const { data } = await apiClient.request<UserDeleteResponse>({
    method: 'DELETE',
    url: contractPathToClientPath(contractPath),
  });
  return data;
}
