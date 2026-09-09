import { apiClient, resolveApiPath } from '@/lib/api/client';
import { fillPath, type EndpointDefinition } from '@/lib/api/endpoints';
import { compactParams } from '@/lib/utils/params';
interface ApiRequestOptions {
  data?: unknown;
  params?: object;
  pathParams?: Record<string, string>;
}

export async function apiRequest<T>(
  endpoint: EndpointDefinition,
  options: ApiRequestOptions = {},
): Promise<T> {
  const path = options.pathParams ? fillPath(endpoint.path, options.pathParams) : endpoint.path;
  const { data } = await apiClient.request<T>({
    method: endpoint.method,
    url: resolveApiPath(path),
    data: options.data,
    params: compactParams(options.params),
  });
  return data;
}
