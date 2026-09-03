import type {
  OrganizationCreateRequest,
  OrganizationDeleteResponse,
  OrganizationListParams,
  OrganizationListResponse,
  OrganizationMutationResponse,
  OrganizationUpdateRequest,
} from '@/types/organizations';
import { apiClient } from './client';
import {
  CONTRACT_ROUTES,
  contractPathToClientPath,
  contractPathWithParams,
} from './endpoints';

const listRoute = CONTRACT_ROUTES.superAdminOrganizations;
const createRoute = CONTRACT_ROUTES.superAdminOrganizationsCreate;

/** GET /api/v1/super-admin/organizations */
export async function fetchOrganizations(
  params: OrganizationListParams,
): Promise<OrganizationListResponse> {
  const { data } = await apiClient.request<OrganizationListResponse>({
    method: listRoute.method,
    url: contractPathToClientPath(listRoute.path),
    params: {
      page: params.page ?? 1,
      page_size: params.page_size ?? 10,
      ...(params.search?.trim() ? { search: params.search.trim() } : {}),
    },
  });
  return data;
}

/** POST /api/v1/super-admin/organizations */
export async function createOrganization(
  payload: OrganizationCreateRequest,
): Promise<OrganizationMutationResponse> {
  const { data } = await apiClient.request<OrganizationMutationResponse>({
    method: createRoute.method,
    url: contractPathToClientPath(createRoute.path),
    data: payload,
  });
  return data;
}

/** PUT /api/v1/super-admin/organizations/{organization_id} */
export async function updateOrganization(
  organizationId: string,
  payload: OrganizationUpdateRequest,
): Promise<OrganizationMutationResponse> {
  const contractPath = contractPathWithParams(
    CONTRACT_ROUTES.superAdminOrganizationDetail.path,
    { organization_id: organizationId },
  );
  const { data } = await apiClient.request<OrganizationMutationResponse>({
    method: 'PUT',
    url: contractPathToClientPath(contractPath),
    data: payload,
  });
  return data;
}

/** DELETE /api/v1/super-admin/organizations/{organization_id} */
export async function deleteOrganization(
  organizationId: string,
): Promise<OrganizationDeleteResponse> {
  const contractPath = contractPathWithParams(
    CONTRACT_ROUTES.superAdminOrganizationDetail.path,
    { organization_id: organizationId },
  );
  const { data } = await apiClient.request<OrganizationDeleteResponse>({
    method: 'DELETE',
    url: contractPathToClientPath(contractPath),
  });
  return data;
}
