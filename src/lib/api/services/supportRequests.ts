import { apiRequest } from '@/lib/api/request';
import { endpoints } from '@/lib/api/endpoints';
import { unwrapItems } from '@/lib/api/unwrapList';
import type {
  SupportCloseResponse,
  SupportRequestItem,
  SupportRequestListParams,
  SupportRequestListResponse,
  SupportRespondRequest,
  SupportRespondResponse,
} from '@/types/support';

export async function listSupportRequests(
  params: SupportRequestListParams,
): Promise<SupportRequestListResponse> {
  const data = await apiRequest<SupportRequestListResponse | SupportRequestItem[]>(
    endpoints.supportRequestsList,
    { params },
  );
  const items = unwrapItems<SupportRequestItem>(data);
  if (Array.isArray(data)) {
    return { items };
  }
  return { ...data, items };
}

export async function respondToSupportRequest(
  payload: SupportRespondRequest,
): Promise<SupportRespondResponse> {
  return apiRequest<SupportRespondResponse>(endpoints.supportRequestsRespond, { data: payload });
}

export async function closeSupportRequest(requestId: string): Promise<SupportCloseResponse> {
  return apiRequest<SupportCloseResponse>(endpoints.supportRequestsClose, {
    pathParams: { id: requestId },
  });
}
