import { apiClient, resolveApiPath } from '@/lib/api/client';
import { endpoints, withPathParam } from '@/lib/api/endpoints';
import type {
  OrganizationListResponse,
  OrganizationMutationResponse,
  OrganizationWriteRequest,
} from '@/types/organization';

export async function fetchOrganizations(): Promise<OrganizationListResponse> {
  const { method, path } = endpoints.organizations.list;
  const { data } = await apiClient.request<OrganizationListResponse>({
    method,
    url: resolveApiPath(path),
  });
  return data;
}

export async function createOrganization(
  payload: OrganizationWriteRequest,
): Promise<OrganizationMutationResponse> {
  const { method, path } = endpoints.organizations.create;
  const { data } = await apiClient.request<OrganizationMutationResponse>({
    method,
    url: resolveApiPath(path),
    data: payload,
  });
  return data;
}

export async function updateOrganization(
  id: string,
  payload: OrganizationWriteRequest,
): Promise<OrganizationMutationResponse> {
  const { method, path } = endpoints.organizations.update;
  const { data } = await apiClient.request<OrganizationMutationResponse>({
    method,
    url: resolveApiPath(withPathParam(path, id)),
    data: payload,
  });
  return data;
}

export async function deleteOrganization(id: string): Promise<{ message: string }> {
  const { method, path } = endpoints.organizations.delete;
  const { data } = await apiClient.request<{ message: string }>({
    method,
    url: resolveApiPath(withPathParam(path, id)),
  });
  return data;
}
