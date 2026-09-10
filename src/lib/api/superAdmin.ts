import { api } from '@/lib/api';
import { SUPER_ADMIN_PATHS } from '@/lib/api/superAdminPaths';
import type {
  CreateOrganizationRequest,
  CreateOrganizationResponse,
  CreateSubscriptionRequest,
  CreateUserRequest,
  CreateUserResponse,
  OrganizationListResponse,
  RespondSupportRequestBody,
  SubscriptionListResponse,
  SubscriptionPlan,
  SuperAdminDashboardResponse,
  SuperAdminLoginRequest,
  SuperAdminLoginResponse,
  SupportRequestListResponse,
  UserListResponse,
} from '@/types/api';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function unwrapListItems<T>(data: unknown): T[] {
  if (Array.isArray(data)) {
    return data as T[];
  }
  if (isRecord(data) && Array.isArray(data.items)) {
    return data.items as T[];
  }
  return [];
}

export async function superAdminLogin(credentials: SuperAdminLoginRequest) {
  return api.post<SuperAdminLoginResponse>(SUPER_ADMIN_PATHS.login, credentials, {
    skipAuth: true,
  });
}

export async function fetchDashboard() {
  return api.get<SuperAdminDashboardResponse>(SUPER_ADMIN_PATHS.dashboard);
}

export async function fetchOrganizations(page = 1) {
  return api.get<OrganizationListResponse>(`${SUPER_ADMIN_PATHS.organizations}?page=${page}`);
}

export async function createOrganization(body: CreateOrganizationRequest) {
  return api.post<CreateOrganizationResponse>(SUPER_ADMIN_PATHS.organizations, body);
}

export async function updateOrganization(id: string, body: CreateOrganizationRequest) {
  return api.put<CreateOrganizationResponse>(SUPER_ADMIN_PATHS.organization(id), body);
}

export async function deleteOrganization(id: string) {
  return api.delete<void>(SUPER_ADMIN_PATHS.organization(id));
}

export async function fetchUsers(page = 1) {
  return api.get<UserListResponse>(`${SUPER_ADMIN_PATHS.users}?page=${page}`);
}

export async function createUser(body: CreateUserRequest) {
  return api.post<CreateUserResponse>(SUPER_ADMIN_PATHS.users, body);
}

export async function updateUser(id: string, body: CreateUserRequest) {
  return api.put<CreateUserResponse>(SUPER_ADMIN_PATHS.user(id), body);
}

export async function deleteUser(id: string) {
  return api.delete<void>(SUPER_ADMIN_PATHS.user(id));
}

export async function fetchSubscriptions() {
  const data = await api.get<SubscriptionListResponse | SubscriptionPlan[]>(
    SUPER_ADMIN_PATHS.subscriptions,
  );
  return unwrapListItems<SubscriptionPlan>(data);
}

export async function createSubscription(body: CreateSubscriptionRequest) {
  return api.post<SubscriptionPlan>(SUPER_ADMIN_PATHS.subscriptions, body);
}

export async function updateSubscription(id: string, body: CreateSubscriptionRequest) {
  return api.put<SubscriptionPlan>(SUPER_ADMIN_PATHS.subscription(id), body);
}

export async function deleteSubscription(id: string) {
  return api.delete<void>(SUPER_ADMIN_PATHS.subscription(id));
}

export async function fetchSupportRequests() {
  const data = await api.get<SupportRequestListResponse | SupportRequestListResponse['items']>(
    SUPER_ADMIN_PATHS.supportRequests,
  );
  return unwrapListItems<SupportRequestListResponse['items'][number]>(data);
}

export async function respondSupportRequest(body: RespondSupportRequestBody) {
  return api.post<void>(SUPER_ADMIN_PATHS.supportRequests, body);
}

export async function closeSupportRequest(id: string) {
  return api.put<void>(SUPER_ADMIN_PATHS.supportRequest(id));
}
