import { apiDelete, apiGet, apiPost, apiPut } from "@/lib/api/client";
import type {
  AdminUserCreateRequest,
  AdminUserListParams,
  AdminUserListResponse,
  AdminUserMutationResponse,
  AdminUserUpdateRequest,
  Organization,
  OrganizationCreateRequest,
  OrganizationListParams,
  OrganizationMutationResponse,
  OrganizationUpdateRequest,
  PaginatedResponse,
  SubscriptionPlan,
  SubscriptionPlanCreateRequest,
  SubscriptionPlanDeleteResponse,
  SubscriptionPlanListParams,
  SubscriptionPlanListResponse,
  SubscriptionPlanRole,
  SubscriptionPlanUpdateRequest,
  SuperAdminDashboard,
  SupportRequest,
  SupportRequestListParams,
  SupportRequestMutationResponse,
  SupportRequestRespondRequest,
} from "@/types/api";

function buildQueryString(
  params: object,
): string {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value));
    }
  }
  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

/** Live OpenAPI: GET /api/v1/super-admin/dashboard */
export async function getSuperAdminDashboard(): Promise<SuperAdminDashboard> {
  return apiGet("/v1/super-admin/dashboard");
}

/** Live OpenAPI: GET /api/v1/super-admin/organizations */
export async function getOrganizations(
  params: OrganizationListParams = {},
): Promise<PaginatedResponse<Organization>> {
  return apiGet(
    `/v1/super-admin/organizations${buildQueryString(params)}`,
  );
}

/** Live OpenAPI: POST /api/v1/super-admin/organizations */
export async function createOrganization(
  data: OrganizationCreateRequest,
): Promise<OrganizationMutationResponse> {
  return apiPost("/v1/super-admin/organizations", data);
}

/** Locked contract: PUT /api/v1/super-admin/organizations/{organization_id} */
export async function updateOrganization(
  organization_id: string,
  data: OrganizationUpdateRequest,
): Promise<OrganizationMutationResponse> {
  return apiPut(`/v1/super-admin/organizations/${organization_id}`, data);
}

/** Locked contract: DELETE /api/v1/super-admin/organizations/{organization_id} */
export async function deleteOrganization(
  organization_id: string,
): Promise<{ message: string }> {
  return apiDelete(`/v1/super-admin/organizations/${organization_id}`);
}

/** Live OpenAPI: GET /api/v1/super-admin/users */
export async function getSuperAdminUsers(
  params: AdminUserListParams = {},
): Promise<AdminUserListResponse> {
  return apiGet(`/v1/super-admin/users${buildQueryString(params)}`);
}

/** Live OpenAPI: POST /api/v1/super-admin/users */
export async function createSuperAdminUser(
  data: AdminUserCreateRequest,
): Promise<AdminUserMutationResponse> {
  return apiPost("/v1/super-admin/users", data);
}

/** Locked contract: PUT /api/v1/super-admin/users/{user_id} */
export async function updateSuperAdminUser(
  user_id: string,
  data: AdminUserUpdateRequest,
): Promise<AdminUserMutationResponse> {
  return apiPut(`/v1/super-admin/users/${user_id}`, data);
}

/** Locked contract: DELETE /api/v1/super-admin/users/{user_id} */
export async function deleteSuperAdminUser(
  user_id: string,
): Promise<{ message: string }> {
  return apiDelete(`/v1/super-admin/users/${user_id}`);
}

/** Ticket path: GET /api/super-admin/subscriptions */
export async function getSubscriptionPlans(
  params: SubscriptionPlanListParams,
): Promise<SubscriptionPlanListResponse> {
  return apiGet(
    `/super-admin/subscriptions${buildQueryString(params)}`,
  );
}

/** Ticket path: POST /api/super-admin/subscriptions */
export async function createSubscriptionPlan(
  data: SubscriptionPlanCreateRequest,
): Promise<SubscriptionPlan> {
  return apiPost("/super-admin/subscriptions", data);
}

/** Ticket path: PUT /api/super-admin/subscriptions/{id} */
export async function updateSubscriptionPlan(
  planId: string,
  role: SubscriptionPlanRole,
  data: SubscriptionPlanUpdateRequest,
): Promise<SubscriptionPlan> {
  return apiPut(
    `/super-admin/subscriptions/${planId}${buildQueryString({ role })}`,
    data,
  );
}

/** Ticket path: DELETE /api/super-admin/subscriptions/{id} (archives active plans) */
export async function deleteSubscriptionPlan(
  planId: string,
  role: SubscriptionPlanRole,
  replacementPlanId?: string,
): Promise<SubscriptionPlanDeleteResponse> {
  return apiDelete(
    `/super-admin/subscriptions/${planId}${buildQueryString({
      role,
      replacement_plan_id: replacementPlanId,
    })}`,
  );
}

/** @deprecated Use deleteSubscriptionPlan */
export const archiveSubscriptionPlan = deleteSubscriptionPlan;

/** Ticket path: GET /api/super-admin/support-requests */
export async function getSupportRequests(
  params: SupportRequestListParams = {},
): Promise<PaginatedResponse<SupportRequest>> {
  return apiGet(`/super-admin/support-requests${buildQueryString(params)}`);
}

/** Ticket path: POST /api/super-admin/support-requests */
export async function respondToSupportRequest(
  data: SupportRequestRespondRequest,
): Promise<SupportRequestMutationResponse> {
  return apiPost("/super-admin/support-requests", data);
}

/** Ticket path: PUT /api/super-admin/support-requests/{id} */
export async function closeSupportRequest(
  requestId: string,
): Promise<SupportRequestMutationResponse> {
  return apiPut(`/super-admin/support-requests/${requestId}`, {
    status: "closed",
  });
}
