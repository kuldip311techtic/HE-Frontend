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
} from "@/types/api";

function buildQueryString(
  params: Record<string, string | number | boolean | undefined | null>,
): string {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value));
    }
  });
  const qs = searchParams.toString();
  return qs ? `?${qs}` : "";
}

/** Live OpenAPI: GET /api/v1/super-admin/dashboard */
export async function getSuperAdminDashboard(): Promise<SuperAdminDashboard> {
  return apiGet("/v1/super-admin/dashboard");
}

/** Live OpenAPI: GET /api/v1/super-admin/organizations */
export async function listOrganizations(
  params: OrganizationListParams = {},
): Promise<PaginatedResponse<Organization>> {
  const qs = buildQueryString({
    page: params.page,
    page_size: params.page_size,
    search: params.search,
  });
  return apiGet(`/v1/super-admin/organizations${qs}`);
}

/** Live OpenAPI: POST /api/v1/super-admin/organizations */
export async function createOrganization(
  body: OrganizationCreateRequest,
): Promise<OrganizationMutationResponse> {
  return apiPost("/v1/super-admin/organizations", body);
}

/** Live OpenAPI: PUT /api/v1/super-admin/organizations/{organization_id} */
export async function updateOrganization(
  organizationId: string,
  body: OrganizationUpdateRequest,
): Promise<OrganizationMutationResponse> {
  return apiPut(`/v1/super-admin/organizations/${organizationId}`, body);
}

/** Live OpenAPI: DELETE /api/v1/super-admin/organizations/{organization_id} */
export async function deleteOrganization(
  organizationId: string,
): Promise<{ message: string }> {
  return apiDelete(`/v1/super-admin/organizations/${organizationId}`);
}

/** Live OpenAPI: GET /api/v1/super-admin/users */
export async function listAdminUsers(
  params: AdminUserListParams = {},
): Promise<AdminUserListResponse> {
  const qs = buildQueryString({
    page: params.page,
    page_size: params.page_size,
    search: params.search,
    role: params.role,
  });
  return apiGet(`/v1/super-admin/users${qs}`);
}

/** Live OpenAPI: POST /api/v1/super-admin/users */
export async function createAdminUser(
  body: AdminUserCreateRequest,
): Promise<AdminUserMutationResponse> {
  return apiPost("/v1/super-admin/users", body);
}

/** Live OpenAPI: PUT /api/v1/super-admin/users/{user_id} */
export async function updateAdminUser(
  userId: string,
  body: AdminUserUpdateRequest,
): Promise<AdminUserMutationResponse> {
  return apiPut(`/v1/super-admin/users/${userId}`, body);
}

/** Live OpenAPI: DELETE /api/v1/super-admin/users/{user_id} */
export async function deleteAdminUser(
  userId: string,
): Promise<{ message: string }> {
  return apiDelete(`/v1/super-admin/users/${userId}`);
}

/** Ticket: GET /api/super-admin/subscriptions — role required per live contract */
export async function listSubscriptionPlans(
  params: SubscriptionPlanListParams,
): Promise<SubscriptionPlanListResponse> {
  const qs = buildQueryString({
    role: params.role,
    page: params.page,
    page_size: params.page_size,
    search: params.search,
    status: params.status,
    billing_frequency: params.billing_frequency,
  });
  return apiGet(`/super-admin/subscriptions${qs}`);
}

/** Ticket: POST /api/super-admin/subscriptions */
export async function createSubscriptionPlan(
  body: SubscriptionPlanCreateRequest,
): Promise<SubscriptionPlan> {
  return apiPost("/super-admin/subscriptions", body);
}

/** Ticket: PUT /api/super-admin/subscriptions/{id} */
export async function updateSubscriptionPlan(
  planId: string,
  role: SubscriptionPlanRole,
  body: SubscriptionPlanUpdateRequest,
): Promise<SubscriptionPlan> {
  return apiPut(
    `/super-admin/subscriptions/${planId}${buildQueryString({ role })}`,
    body,
  );
}

/** Ticket: DELETE /api/super-admin/subscriptions/{id} */
export async function deleteSubscriptionPlan(
  planId: string,
  role: SubscriptionPlanRole,
  replacementPlanId?: string,
): Promise<SubscriptionPlanDeleteResponse> {
  const qs = buildQueryString({
    role,
    replacement_plan_id: replacementPlanId,
  });
  return apiDelete(`/super-admin/subscriptions/${planId}${qs}`);
}

/** Live OpenAPI: GET /api/v1/support-requests */
export async function listSupportRequests(
  params: SupportRequestListParams = {},
): Promise<PaginatedResponse<SupportRequest>> {
  const qs = buildQueryString({
    page: params.page,
    page_size: params.page_size,
    search: params.search,
  });
  return apiGet(`/v1/support-requests${qs}`);
}
