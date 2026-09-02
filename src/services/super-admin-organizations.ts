import { apiRequest } from "@/services/api-client";
import type {
  CreateOrganizationRequest,
  OrganizationListData,
  OrganizationListResponse,
  OrganizationMutationResponse,
  UpdateOrganizationRequest,
} from "@/types/organization";

const SUPER_ADMIN_ORGANIZATIONS_PATH = "/api/super-admin/organizations";

export async function fetchOrganizations(): Promise<OrganizationListData> {
  const response = await apiRequest<OrganizationListResponse>(
    SUPER_ADMIN_ORGANIZATIONS_PATH,
    {
      method: "GET",
      auth: true,
    },
  );

  return response.data;
}

export async function createOrganization(
  payload: CreateOrganizationRequest,
): Promise<OrganizationMutationResponse> {
  return apiRequest<OrganizationMutationResponse>(
    SUPER_ADMIN_ORGANIZATIONS_PATH,
    {
      method: "POST",
      body: payload,
      auth: true,
    },
  );
}

export async function updateOrganization(
  id: string,
  payload: UpdateOrganizationRequest,
): Promise<OrganizationMutationResponse> {
  return apiRequest<OrganizationMutationResponse>(
    `${SUPER_ADMIN_ORGANIZATIONS_PATH}/${id}`,
    {
      method: "PUT",
      body: payload,
      auth: true,
    },
  );
}

export async function deleteOrganization(
  id: string,
): Promise<OrganizationMutationResponse> {
  return apiRequest<OrganizationMutationResponse>(
    `${SUPER_ADMIN_ORGANIZATIONS_PATH}/${id}`,
    {
      method: "DELETE",
      auth: true,
    },
  );
}
