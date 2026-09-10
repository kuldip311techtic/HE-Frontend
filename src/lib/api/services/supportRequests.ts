import { apiRequest } from '@/lib/api/request';
import { endpoints } from '@/lib/api/endpoints';
import { unwrapItems } from '@/lib/api/unwrapList';
import type {
  SupportRequestItem,
  SupportRequestListParams,
  SupportRequestListResponse,
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
