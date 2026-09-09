import { apiRequest } from '@/lib/api/request';
import { endpoints } from '@/lib/api/endpoints';
import type {
  OrganizationCreateRequest,
  OrganizationDeleteResponse,
  OrganizationListParams,
  OrganizationListResponse,
  OrganizationMutationResponse,
  OrganizationUpdateRequest,
} from '@/types/organization';

export async function listOrganizations(
  params: OrganizationListParams,
): Promise<OrganizationListResponse> {
  return apiRequest<OrganizationListResponse>(endpoints.organizationsList, { params });
}

export async function createOrganization(
  payload: OrganizationCreateRequest,
): Promise<OrganizationMutationResponse> {
  return apiRequest<OrganizationMutationResponse>(endpoints.organizationsCreate, { data: payload });
}

export async function updateOrganization(
  organizationId: string,
  payload: OrganizationUpdateRequest,
): Promise<OrganizationMutationResponse> {
  return apiRequest<OrganizationMutationResponse>(endpoints.organizationsUpdate, {
    pathParams: { organization_id: organizationId },
    data: payload,
  });
}

export async function deleteOrganization(organizationId: string): Promise<OrganizationDeleteResponse> {
  return apiRequest<OrganizationDeleteResponse>(endpoints.organizationsDelete, {
    pathParams: { organization_id: organizationId },
  });
}
