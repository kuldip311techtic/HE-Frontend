import axios from "axios";
import {
  apiClient,
  apiDelete,
  apiGet,
  apiPost,
  apiPut,
} from "@/lib/api/client";
import type {
  AdminUserCreateRequest,
  AdminUserDeleteResponse,
  AdminUserListResponse,
  AdminUserMutationResponse,
  AdminUserUpdateRequest,
  ListQueryParams,
  LoginRequest,
  LoginResponse,
  Organization,
  OrganizationCreateRequest,
  OrganizationDeleteResponse,
  OrganizationMutationResponse,
  OrganizationProfile,
  OrganizationUpdateRequest,
  PaginatedResponse,
  SubscriptionPlanCreateRequest,
  SubscriptionPlanDeleteResponse,
  SubscriptionPlanItem,
  SubscriptionPlanListResponse,
  SubscriptionPlanRole,
  SubscriptionPlanUpdateRequest,
  SuperAdminDashboard,
  SuperAdminProfile,
  SupportRequestCloseResponse,
  SupportRequestListResponse,
  SupportRequestRespondRequest,
  SupportRequestRespondResponse,
} from "@/types/api";

function buildParams(params?: ListQueryParams): Record<string, string | number> {
  if (!params) return {};
  const query: Record<string, string | number> = {};
  if (params.page != null) query.page = params.page;
  if (params.page_size != null) query.page_size = params.page_size;
  if (params.search?.trim()) query.search = params.search.trim();
  if (params.role) query.role = params.role;
  if (params.status) query.status = params.status;
  return query;
}

export async function loginSuperAdmin(
  body: LoginRequest,
): Promise<LoginResponse> {
  try {
    return await apiPost<LoginResponse, LoginRequest>(
      "/super-admin/login",
      body,
    );
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return apiPost<LoginResponse, LoginRequest>("/v1/auth/login", body);
    }
    throw error;
  }
}

export async function getOrganizationProfile(): Promise<{
  success: boolean;
  profile: OrganizationProfile;
}> {
  return apiGet("/organization/profile");
}

export async function updateOrganizationProfile(
  data: Partial<OrganizationProfile>,
): Promise<{ success: boolean; message: string }> {
  return apiPost("/organization/profile", data);
}

export async function createTeam(data: {
  team_name: string;
  age_group: string;
  coaches?: { id: string }[];
  players?: { id: string }[];
}): Promise<{ id: string; team_name: string; age_group: string }> {
  return apiPost("/admin/teams", data);
}

export async function inviteCoach(data: {
  email: string;
  phone?: string;
  company?: string;
}): Promise<{ success: boolean; message: string }> {
  return apiPost("/admin/invite-coach", data);
}

export async function getSuperAdminDashboard(): Promise<SuperAdminDashboard> {
  return apiGet("/v1/super-admin/dashboard");
}

export async function getSuperAdminProfile(): Promise<SuperAdminProfile> {
  return apiGet("/v1/super-admin/profile");
}

export async function getOrganizations(
  params?: ListQueryParams,
): Promise<PaginatedResponse<Organization>> {
  const response = await apiClient.get<PaginatedResponse<Organization>>(
    "/v1/super-admin/organizations",
    { params: buildParams(params) },
  );
  return response.data;
}

export async function createOrganization(
  data: OrganizationCreateRequest,
): Promise<OrganizationMutationResponse> {
  return apiPost("/v1/super-admin/organizations", data);
}

export async function updateOrganization(
  id: string,
  data: OrganizationUpdateRequest,
): Promise<OrganizationMutationResponse> {
  return apiPut(`/v1/super-admin/organizations/${id}`, data);
}

export async function deleteOrganization(
  id: string,
): Promise<OrganizationDeleteResponse> {
  return apiDelete(`/v1/super-admin/organizations/${id}`);
}

export async function getSuperAdminUsers(
  params?: ListQueryParams,
): Promise<AdminUserListResponse> {
  const response = await apiClient.get<AdminUserListResponse>(
    "/v1/super-admin/users",
    { params: buildParams(params) },
  );
  return response.data;
}

export async function createSuperAdminUser(
  data: AdminUserCreateRequest,
): Promise<AdminUserMutationResponse> {
  return apiPost("/v1/super-admin/users", data);
}

export async function updateSuperAdminUser(
  id: string,
  data: AdminUserUpdateRequest,
): Promise<AdminUserMutationResponse> {
  return apiPut(`/v1/super-admin/users/${id}`, data);
}

export async function deleteSuperAdminUser(
  id: string,
): Promise<AdminUserDeleteResponse> {
  return apiDelete(`/v1/super-admin/users/${id}`);
}

async function withSubscriptionPathFallback<T>(
  primary: () => Promise<T>,
  fallback: () => Promise<T>,
): Promise<T> {
  try {
    return await primary();
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return fallback();
    }
    throw error;
  }
}

export async function getSubscriptionPlans(
  role: SubscriptionPlanRole,
  params?: Omit<ListQueryParams, "role">,
): Promise<SubscriptionPlanListResponse> {
  const queryParams = { ...buildParams(params), role };

  return withSubscriptionPathFallback(
    async () => {
      const response = await apiClient.get<SubscriptionPlanListResponse>(
        "/super-admin/subscriptions",
        { params: queryParams },
      );
      return response.data;
    },
    async () => {
      const response = await apiClient.get<SubscriptionPlanListResponse>(
        "/v1/super-admin/subscription-plans",
        { params: queryParams },
      );
      return response.data;
    },
  );
}

export async function createSubscriptionPlan(
  data: SubscriptionPlanCreateRequest,
): Promise<SubscriptionPlanItem> {
  return withSubscriptionPathFallback(
    () => apiPost("/super-admin/subscriptions", data),
    () => apiPost("/v1/super-admin/subscription-plans", data),
  );
}

export async function updateSubscriptionPlan(
  id: string,
  role: SubscriptionPlanRole,
  data: SubscriptionPlanUpdateRequest,
): Promise<SubscriptionPlanItem> {
  return withSubscriptionPathFallback(
    async () => {
      const response = await apiClient.put<SubscriptionPlanItem>(
        `/super-admin/subscriptions/${id}`,
        data,
        { params: { role } },
      );
      return response.data;
    },
    async () => {
      const response = await apiClient.put<SubscriptionPlanItem>(
        `/v1/super-admin/subscription-plans/${id}`,
        data,
        { params: { role } },
      );
      return response.data;
    },
  );
}

export async function deleteSubscriptionPlan(
  id: string,
  role: SubscriptionPlanRole,
  replacementPlanId?: string,
): Promise<SubscriptionPlanDeleteResponse> {
  const params: Record<string, string> = { role };
  if (replacementPlanId) params.replacement_plan_id = replacementPlanId;

  return withSubscriptionPathFallback(
    async () => {
      const response = await apiClient.delete<SubscriptionPlanDeleteResponse>(
        `/super-admin/subscriptions/${id}`,
        { params },
      );
      return response.data;
    },
    async () => {
      const response = await apiClient.delete<SubscriptionPlanDeleteResponse>(
        `/v1/super-admin/subscription-plans/${id}`,
        { params },
      );
      return response.data;
    },
  );
}

export async function getSupportRequests(
  params?: ListQueryParams,
): Promise<SupportRequestListResponse> {
  const response = await apiClient.get<SupportRequestListResponse>(
    "/v1/support-requests",
    { params: buildParams(params) },
  );
  return response.data;
}

export async function respondToSupportRequest(
  data: SupportRequestRespondRequest,
): Promise<SupportRequestRespondResponse> {
  return apiPost("/v1/support-requests", data);
}

export async function closeSupportRequest(
  id: string,
): Promise<SupportRequestCloseResponse> {
  return apiPut(`/v1/support-requests/${id}`);
}
