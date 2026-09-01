import { apiRequest, unwrapList } from "@/services/api-client";
import type {
  CreateOrganizationRequest,
  PaginatedOrganizationsResponse,
  SuperAdminOrganization,
  UpdateOrganizationRequest,
} from "@/types/super-admin";

export async function listOrganizations(): Promise<PaginatedOrganizationsResponse> {
  return apiRequest<PaginatedOrganizationsResponse>(
    "/api/v1/super-admin/organizations",
    { method: "GET" }
  );
}

export async function getOrganizationsList(): Promise<SuperAdminOrganization[]> {
  const response = await listOrganizations();
  return unwrapList<SuperAdminOrganization>(
    response as unknown as Record<string, unknown>,
    "items"
  );
}

export async function createOrganization(
  data: CreateOrganizationRequest
): Promise<SuperAdminOrganization> {
  return apiRequest<SuperAdminOrganization>(
    "/api/v1/super-admin/organizations",
    { method: "POST", body: data }
  );
}

export async function updateOrganization(
  organizationId: string,
  data: UpdateOrganizationRequest
): Promise<SuperAdminOrganization> {
  return apiRequest<SuperAdminOrganization>(
    `/api/v1/super-admin/organizations/${organizationId}`,
    { method: "PUT", body: data }
  );
}

export async function deleteOrganization(
  organizationId: string
): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(
    `/api/v1/super-admin/organizations/${organizationId}`,
    { method: "DELETE" }
  );
}
