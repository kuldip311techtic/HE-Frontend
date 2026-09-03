import { apiClient } from '@/lib/api/client';
import type {
  OrganizationCreateRequest,
  OrganizationDeleteResponse,
  OrganizationItem,
  OrganizationListParams,
  OrganizationListResponse,
  OrganizationUpdateRequest,
} from '@/types/api';

export async function fetchOrganizations(
  params: OrganizationListParams,
): Promise<OrganizationListResponse> {
  const { data } = await apiClient.get<OrganizationListResponse>('/v1/super-admin/organizations', {
    params,
  });
  return data;
}

export async function createOrganization(
  body: OrganizationCreateRequest,
): Promise<OrganizationItem> {
  const { data } = await apiClient.post<OrganizationItem>('/v1/super-admin/organizations', body);
  return data;
}

export async function updateOrganization(
  organizationId: string,
  body: OrganizationUpdateRequest,
): Promise<OrganizationItem> {
  const { data } = await apiClient.put<OrganizationItem>(
    `/v1/super-admin/organizations/${organizationId}`,
    body,
  );
  return data;
}

export async function deleteOrganization(
  organizationId: string,
): Promise<OrganizationDeleteResponse> {
  const { data } = await apiClient.delete<OrganizationDeleteResponse>(
    `/v1/super-admin/organizations/${organizationId}`,
  );
  return data;
}

export function getOrganizationPhone(organization: OrganizationItem): string {
  return organization.phone_number ?? organization.phone ?? '—';
}

export function getOrganizationDisplayName(organization: OrganizationItem): string {
  const name = organization.name?.trim();
  if (name) {
    return name;
  }

  const alias = organization.organization?.trim();
  if (alias) {
    return alias;
  }

  return '—';
}
