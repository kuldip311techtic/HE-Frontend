import type {
  SupportRequestItem,
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
} from './endpoints';
import { normalizePaginatedListResponse } from './normalize-list-response';

const listRoute = CONTRACT_ROUTES.superAdminSupportRequests;
const respondRoute = CONTRACT_ROUTES.superAdminSupportRequestsRespond;

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
  return normalizePaginatedListResponse<SupportRequestItem>(
    data,
    listRoute.listUnwrapKey,
    params.page ?? 1,
    params.page_size ?? 10,
  );
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
