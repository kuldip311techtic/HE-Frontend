import type { PaginationMeta } from '@/types/api';
import type {
  SupportRequestListParams,
  SupportRequestListResponse,
  SupportRequestMutationResponse,
  SupportRequestRespondRequest,
} from '@/types/support-requests';
import { apiClient } from './client';
import {
  CONTRACT_ROUTES,
  contractPathToClientPath,
  contractPathWithParams,
  unwrapListResponse,
} from './endpoints';

const listRoute = CONTRACT_ROUTES.superAdminSupportRequests;
const respondRoute = CONTRACT_ROUTES.superAdminSupportRequestsRespond;

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
): SupportRequestListResponse {
  const unwrapped = unwrapListResponse<
    SupportRequestListResponse | SupportRequestListResponse['items']
  >(body, listRoute.listUnwrapKey);

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
    Array.isArray((unwrapped as SupportRequestListResponse).items)
  ) {
    const response = unwrapped as SupportRequestListResponse;
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

/** GET /api/super-admin/support-requests */
export async function fetchSupportRequests(
  params: SupportRequestListParams,
): Promise<SupportRequestListResponse> {
  const { data } = await apiClient.request<unknown>({
    method: listRoute.method,
    url: contractPathToClientPath(listRoute.path),
    params: {
      page: params.page ?? 1,
      page_size: params.page_size ?? 10,
      ...(params.search?.trim() ? { search: params.search.trim() } : {}),
      ...(params.status?.trim() ? { status: params.status.trim() } : {}),
    },
  });
  return normalizeListResponse(data, params.page ?? 1, params.page_size ?? 10);
}

/** POST /api/super-admin/support-requests */
export async function respondToSupportRequest(
  payload: SupportRequestRespondRequest,
): Promise<SupportRequestMutationResponse> {
  const { data } = await apiClient.request<SupportRequestMutationResponse>({
    method: respondRoute.method,
    url: contractPathToClientPath(respondRoute.path),
    data: payload,
  });
  return data;
}

/** PUT /api/super-admin/support-requests/{id} */
export async function closeSupportRequest(
  requestId: string,
): Promise<SupportRequestMutationResponse> {
  const contractPath = contractPathWithParams(
    CONTRACT_ROUTES.superAdminSupportRequestDetail.path,
    { id: requestId },
  );
  const { data } = await apiClient.request<SupportRequestMutationResponse>({
    method: 'PUT',
    url: contractPathToClientPath(contractPath),
  });
  return data;
}
