import { apiClient, resolveApiPath } from '@/lib/api/client';
import { endpoints, withPathParam } from '@/lib/api/endpoints';
import type {
  SupportRequestListResponse,
  SupportRequestMutationResponse,
  SupportRequestRespondRequest,
  SupportRequestUpdateRequest,
} from '@/types/support';

export async function fetchSupportRequests(): Promise<SupportRequestListResponse> {
  const { method, path } = endpoints.supportRequests.list;
  const { data } = await apiClient.request<SupportRequestListResponse>({
    method,
    url: resolveApiPath(path),
  });
  return data;
}

export async function respondToSupportRequest(
  payload: SupportRequestRespondRequest,
): Promise<SupportRequestMutationResponse> {
  const { method, path } = endpoints.supportRequests.create;
  const { data } = await apiClient.request<SupportRequestMutationResponse>({
    method,
    url: resolveApiPath(path),
    data: payload,
  });
  return data;
}

export async function updateSupportRequest(
  id: string,
  payload: SupportRequestUpdateRequest,
): Promise<SupportRequestMutationResponse> {
  const { method, path } = endpoints.supportRequests.update;
  const { data } = await apiClient.request<SupportRequestMutationResponse>({
    method,
    url: resolveApiPath(withPathParam(path, id)),
    data: payload,
  });
  return data;
}
