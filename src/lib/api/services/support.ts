import { apiClient, resolveApiPath } from '@/lib/api/client';
import { endpoints } from '@/lib/api/endpoints';
import type { SupportRequestListResponse } from '@/types/support';

export async function fetchSupportRequests(): Promise<SupportRequestListResponse> {
  const { method, path } = endpoints.supportRequests.list;
  const { data } = await apiClient.request<SupportRequestListResponse>({
    method,
    url: resolveApiPath(path),
  });
  return data;
}
