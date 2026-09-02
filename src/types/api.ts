export interface ApiErrorDetail {
  code: string;
  message: string;
  details?: Array<{ field: string; message: string }> | null;
}

export interface ApiErrorBody {
  message?: string;
  detail?: string;
  error?: string | ApiErrorDetail;
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

export type BillingFrequency = "monthly" | "yearly";
export type PlanStatus = "active" | "archived";
export type SubscriptionPlanRole = "org_admin" | "coach";
export type LimitType = "limited" | "unlimited";
export type HistoricalRecordsDuration =
  | "1_month"
  | "3_months"
  | "6_months"
  | "1_year"
  | "unlimited";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserPublic {
  id: string;
  email: string;
  role: string;
  org_id: string | null;
  first_name: string | null;
  last_name: string | null;
  is_super_admin: boolean;
  is_active: boolean;
  last_sign_in_at: string | null;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in_hours: number;
  user: UserPublic;
}

export interface Organization {
  id: string;
  name: string;
  contact_email: string;
  phone_number: string;
  address: string;
  join_code: string;
  organization?: string;
  email?: string;
  phone?: string | null;
  created_at?: string | null;
}

export interface OrganizationCreateRequest {
  name: string;
  contact_email: string;
  phone_number: string;
  address: string;
}

export interface OrganizationUpdateRequest {
  name?: string | null;
  contact_email?: string | null;
  phone_number?: string | null;
  address?: string | null;
}

export interface OrganizationMutationResponse {
  message: string;
  id: string;
  name: string;
  organization: string;
  contact_email: string;
  email: string;
  phone_number: string | null;
  phone: string | null;
  address: string | null;
  join_code?: string | null;
}

export interface OrganizationDeleteResponse {
  message: string;
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

export interface RoleOption {
  value: string;
  label: string;
  description?: string;
}

export interface AdminUserItem {
  id: string;
  first_name: string | null;
  last_name: string | null;
  name: string;
  email: string;
  role: string;
  roles: string[];
  description: string | null;
  org_id: string | null;
  is_super_admin: boolean;
  is_active: boolean;
  is_self: boolean;
  last_sign_in_at: string | null;
  created_at: string | null;
}

export interface AdminUserListResponse extends PaginatedResponse<AdminUserItem> {
  roles: RoleOption[];
}

export interface AdminUserCreateRequest {
  first_name: string;
  last_name: string;
  name?: string | null;
  email: string;
  password: string;
  role: string;
  org_id?: string | null;
}

export interface AdminUserUpdateRequest {
  first_name?: string | null;
  last_name?: string | null;
  name?: string | null;
  email?: string | null;
  password?: string | null;
  role?: string | null;
  org_id?: string | null;
}

export interface AdminUserMutationResponse extends AdminUserItem {
  message: string;
}

export interface AdminUserDeleteResponse {
  message: string;
}

export interface SubscriptionPlanItem {
  id: string;
  role: SubscriptionPlanRole;
  name: string;
  billing_frequency: BillingFrequency;
  currency: string;
  price_amount: string;
  stripe_product_id: string;
  stripe_price_id: string;
  teams_limit_type: LimitType;
  teams_count: number | null;
  coaches_limit_type: LimitType | null;
  coaches_count: number | null;
  players_limit_type: LimitType;
  players_count: number | null;
  historical_records_duration: HistoricalRecordsDuration;
  is_active: boolean;
  include_offline_sync: boolean;
  status: PlanStatus;
  archived_at: string | null;
  replacement_plan_id: string | null;
  description: string | null;
  features: string[];
  created_at: string;
  updated_at: string;
}

export interface SubscriptionPlanListResponse
  extends PaginatedResponse<SubscriptionPlanItem> {
  counts: { active: number; archived: number };
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

export type SubscriptionPlanUpdateRequest = Partial<SubscriptionPlanCreateRequest>;

export interface SubscriptionPlanDeleteResponse {
  message: string;
}

export interface SupportAttachmentResponse {
  original_name: string;
  content_type: string | null;
  size_bytes: number;
  download_url: string;
}

export interface SupportRequestItem {
  id: string;
  email: string;
  name: string;
  subject: string;
  message: string;
  created_at: string;
  attachment: SupportAttachmentResponse | null;
}

export type SupportRequestListResponse = PaginatedResponse<SupportRequestItem>;

export interface SupportRequestRespondRequest {
  request_id: string;
  response: string;
}

export interface SupportRequestRespondResponse {
  message: string;
}

export interface SupportRequestCloseResponse {
  message: string;
}

export interface ListQueryParams {
  page?: number;
  page_size?: number;
  search?: string;
  role?: string;
  status?: string;
}
