export interface ApiErrorBody {
  message?: string;
  detail?: string;
  error?: string | { code?: string; message?: string; details?: Array<{ field?: string; message?: string }> };
  errors?: Record<string, string[]>;
  success?: boolean;
}

export interface PaginationMeta {
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationMeta;
}

export interface Organization {
  id: string;
  name: string;
  contact_email: string;
  phone_number: string;
  address: string;
  join_code: string;
  created_at?: string | null;
}

export interface OrganizationCreateRequest {
  name: string;
  contact_email: string;
  phone_number: string;
  address: string;
}

export interface OrganizationUpdateRequest {
  name?: string;
  contact_email?: string;
  phone_number?: string;
  address?: string;
}

export interface OrganizationMutationResponse {
  message: string;
  id: string;
  name: string;
  contact_email: string;
  phone_number: string;
  address: string;
}

export interface OrganizationProfile {
  organization_name: string;
  name: string;
  description: string;
  contact_info: string;
  first_name: string;
  last_name: string;
}

export interface SuperAdminDashboard {
  total_organizations: number;
  total_coaches: number;
  total_players: number;
  total_sessions: number;
  active_subscriptions: number;
  revenue_overview: number;
  description: string | null;
  link: string | null;
  error: string | null;
}

export interface UserPublic {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  name?: string;
  role: string;
  roles?: string[];
  is_super_admin: boolean;
  is_active?: boolean;
}

export interface LoginResponse {
  access_token: string;
  token_type?: string;
  expires_in_hours?: number;
  user: UserPublic;
}

export interface SuperAdminLoginRequest {
  email: string;
  password: string;
}

export interface RoleOption {
  value: string;
  label: string;
  description?: string;
}

export interface AdminUser {
  id: string;
  first_name: string | null;
  last_name: string | null;
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

export interface AdminUserListResponse extends PaginatedResponse<AdminUser> {
  roles: RoleOption[];
}

export interface AdminUserCreateRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: string;
  org_id?: string | null;
}

export interface AdminUserUpdateRequest {
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
  role?: string;
  org_id?: string | null;
}

export interface AdminUserMutationResponse extends AdminUser {
  message: string;
}

export type SubscriptionPlanRole = "org_admin" | "coach";
export type BillingFrequency = "monthly" | "yearly";
export type PlanStatus = "active" | "archived";
export type LimitType = "limited" | "unlimited";
export type HistoricalRecordsDuration =
  | "1_month"
  | "3_months"
  | "6_months"
  | "1_year"
  | "unlimited";

export interface SubscriptionPlan {
  id: string;
  role: SubscriptionPlanRole;
  name: string;
  billing_frequency: BillingFrequency;
  currency: string;
  price_amount: string;
  status: PlanStatus;
  is_active: boolean;
  description: string | null;
  features: string[];
  created_at: string;
  updated_at: string;
}

export interface SubscriptionPlanListResponse extends PaginatedResponse<SubscriptionPlan> {
  counts?: {
    active: number;
    archived: number;
  };
}

export interface SubscriptionPlanCreateRequest {
  role: SubscriptionPlanRole;
  name: string;
  billing_frequency: BillingFrequency;
  currency: string;
  price_amount: number | string;
  teams_limit_type: LimitType;
  teams_count?: number | null;
  coaches_limit_type?: LimitType | null;
  coaches_count?: number | null;
  players_limit_type: LimitType;
  players_count?: number | null;
  historical_records_duration: HistoricalRecordsDuration;
  is_active?: boolean;
  include_offline_sync?: boolean;
  description?: string | null;
  features?: string[];
}

export interface SubscriptionPlanUpdateRequest {
  name?: string | null;
  billing_frequency?: BillingFrequency | null;
  currency?: string | null;
  price_amount?: number | string | null;
  teams_limit_type?: LimitType | null;
  teams_count?: number | null;
  coaches_limit_type?: LimitType | null;
  coaches_count?: number | null;
  players_limit_type?: LimitType | null;
  players_count?: number | null;
  historical_records_duration?: HistoricalRecordsDuration | null;
  is_active?: boolean | null;
  include_offline_sync?: boolean | null;
  description?: string | null;
  features?: string[] | null;
}

export interface SubscriptionPlanDeleteResponse {
  message: string;
}

export type SupportRequestStatus = "open" | "closed" | "pending" | string;

export interface SupportRequest {
  id: string;
  subject: string;
  message: string;
  email: string;
  name: string;
  status?: SupportRequestStatus;
  attachment_url?: string | null;
  created_at: string;
  updated_at?: string | null;
}

export interface ListQueryParams {
  page?: number;
  page_size?: number;
  search?: string;
}

export type OrganizationListParams = ListQueryParams;

export interface AdminUserListParams extends ListQueryParams {
  role?: string;
}

export interface SubscriptionPlanListParams extends ListQueryParams {
  role: SubscriptionPlanRole;
  status?: PlanStatus;
  billing_frequency?: BillingFrequency;
}

export type SupportRequestListParams = ListQueryParams;

export interface SupportRequestRespondRequest {
  request_id: string;
  response: string;
}

export interface SupportRequestMutationResponse {
  message: string;
  id?: string;
  status?: SupportRequestStatus;
}
