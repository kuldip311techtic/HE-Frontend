export interface ApiErrorBody {
  success?: boolean;
  error?: {
    code?: string;
    message?: string;
  };
  message?: string;
  detail?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token?: string;
  access_token?: string;
  jwt?: string;
  message?: string;
}

export interface DashboardResponse {
  total_organizations: number;
  total_coaches: number;
  total_players: number;
  total_sessions: number;
  active_subscriptions: number;
  revenue_overview: number;
  description?: string | null;
  link?: string | null;
  error?: Record<string, unknown> | null;
}

export interface PaginationMeta {
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface SuperAdminUser {
  id: string;
  first_name?: string | null;
  last_name?: string | null;
  name: string;
  email: string;
  role: string;
  roles: string[];
  description?: string | null;
  org_id?: string | null;
  is_super_admin: boolean;
  is_active: boolean;
  is_self: boolean;
  last_sign_in_at?: string | null;
  created_at?: string | null;
}

export interface SuperAdminOrganization {
  id: string;
  name: string;
  contact_email?: string | null;
  phone_number?: string | null;
  address?: string | null;
  created_at?: string | null;
}

export interface CreateOrganizationRequest {
  name: string;
  contact_email: string;
  phone_number: string;
  address: string;
}

export interface UpdateOrganizationRequest {
  name?: string;
  contact_email?: string;
  phone_number?: string;
  address?: string;
}

export interface PaginatedUsersResponse {
  items: SuperAdminUser[];
  pagination: PaginationMeta;
  roles: Array<{ value: string; label: string; description: string }>;
}

export interface PaginatedOrganizationsResponse {
  items: SuperAdminOrganization[];
  pagination?: PaginationMeta;
}

export interface CreateUserRequest {
  first_name: string;
  last_name: string;
  name?: string | null;
  email: string;
  password: string;
  role: string;
  org_id?: string | null;
}

export interface UpdateUserRequest {
  first_name?: string | null;
  last_name?: string | null;
  name?: string | null;
  email?: string | null;
  password?: string | null;
  role?: string | null;
  org_id?: string | null;
}

export type SubscriptionStatus = "active" | "inactive";

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  duration: string;
  status: SubscriptionStatus | string;
  description?: string | null;
}

export interface CreateSubscriptionRequest {
  name: string;
  price: number;
  duration: string;
  description?: string;
  status?: SubscriptionStatus;
}

export interface UpdateSubscriptionRequest {
  name?: string;
  price?: number;
  duration?: string;
  description?: string | null;
  status?: SubscriptionStatus;
}

export interface SubscriptionsListResponse {
  items?: SubscriptionPlan[];
  data?: SubscriptionPlan[];
  results?: SubscriptionPlan[];
  pagination?: PaginationMeta;
}

export type SupportRequestStatus = "open" | "closed" | "pending" | string;

export interface SupportRequest {
  id: string;
  user?: string | null;
  user_name?: string | null;
  user_email?: string | null;
  subject?: string | null;
  message?: string | null;
  response?: string | null;
  status: SupportRequestStatus;
  created_at?: string | null;
  request_date?: string | null;
  updated_at?: string | null;
}

export interface SupportRequestsListResponse {
  items?: SupportRequest[];
  data?: SupportRequest[];
  results?: SupportRequest[];
  pagination?: PaginationMeta;
}

export interface RespondSupportRequestBody {
  id: string;
  response: string;
}

export interface CloseSupportRequestBody {
  status?: "closed";
}
