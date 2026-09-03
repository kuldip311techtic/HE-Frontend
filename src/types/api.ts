export interface ApiErrorDetail {
  code: string;
  message: string;
  details?: Array<{ field: string; message: string }>;
}

export interface ApiErrorEnvelope {
  success: false;
  error: ApiErrorDetail;
}

export type UserRole = 'super_admin' | 'org_admin' | 'coach' | 'player';

export interface UserPublic {
  id: string;
  email: string;
  role: UserRole;
  org_id?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  is_super_admin: boolean;
  is_active: boolean;
  last_sign_in_at?: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type?: string;
  expires_in_hours: number;
  user: UserPublic;
}

export interface DashboardAnalyticsResponse {
  total_organizations: number;
  total_coaches: number;
  total_players: number;
  total_sessions: number;
  active_subscriptions: number;
  revenue_overview: number;
  description?: string | null;
  link?: string | null;
  error?: null;
}

export type BillingFrequency = 'monthly' | 'yearly';
export type PlanStatus = 'active' | 'archived';
export type SubscriptionPlanRole = 'org_admin' | 'coach';
export type LimitType = 'limited' | 'unlimited';
export type HistoricalRecordsDuration =
  | '1_month'
  | '3_months'
  | '6_months'
  | '1_year'
  | 'unlimited';

export interface PaginationMeta {
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface SubscriptionPlanStatusCounts {
  active: number;
  archived: number;
}

export interface SubscriptionPlanItem {
  id: string;
  role: SubscriptionPlanRole;
  name: string;
  billing_frequency: BillingFrequency;
  currency: string;
  price_amount: string;
  stripe_product_id?: string;
  stripe_price_id?: string;
  teams_limit_type: LimitType;
  teams_count?: number | null;
  coaches_limit_type?: LimitType | null;
  coaches_count?: number | null;
  players_limit_type: LimitType;
  players_count?: number | null;
  historical_records_duration: HistoricalRecordsDuration;
  is_active: boolean;
  include_offline_sync: boolean;
  status: PlanStatus;
  archived_at?: string | null;
  replacement_plan_id?: string | null;
  stripe_status?: PlanStatus | null;
  description?: string | null;
  features?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface SubscriptionPlanListResponse {
  items: SubscriptionPlanItem[];
  pagination: PaginationMeta;
  counts: SubscriptionPlanStatusCounts;
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

export interface SubscriptionPlanArchiveResponse {
  message: string;
}

export interface SubscriptionPlanListParams {
  role: SubscriptionPlanRole;
  page?: number;
  page_size?: number;
  status?: PlanStatus;
  billing_frequency?: BillingFrequency;
  search?: string;
}

export type AdminUserRole = UserRole;

export interface RoleOption {
  value: string;
  label: string;
  description: string;
}

export interface AdminUserItem {
  id: string;
  first_name?: string | null;
  last_name?: string | null;
  name: string;
  email: string;
  role: AdminUserRole;
  roles: string[];
  description?: string | null;
  org_id?: string | null;
  is_super_admin: boolean;
  is_active: boolean;
  is_self: boolean;
  last_sign_in_at?: string | null;
  created_at?: string | null;
}

export interface AdminUserListResponse {
  items: AdminUserItem[];
  pagination: PaginationMeta;
  roles: RoleOption[];
}

export interface AdminUserCreateRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: AdminUserRole;
  name?: string | null;
  org_id?: string | null;
}

export interface AdminUserUpdateRequest {
  first_name?: string | null;
  last_name?: string | null;
  name?: string | null;
  email?: string | null;
  password?: string | null;
  role?: AdminUserRole | null;
  org_id?: string | null;
}

export interface AdminUserDeleteResponse {
  message: string;
}

export interface AdminUserListParams {
  page?: number;
  page_size?: number;
  role?: AdminUserRole;
  search?: string;
}

export interface SupportAttachmentResponse {
  original_name: string;
  content_type?: string | null;
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
  attachment?: SupportAttachmentResponse | null;
}

export interface SupportRequestListResponse {
  items: SupportRequestItem[];
  pagination: PaginationMeta;
}

export interface SupportRequestListParams {
  page?: number;
  page_size?: number;
  search?: string;
}

export interface SupportRequestRespondRequest {
  request_id: string;
  response: string;
}

export interface SupportRequestCloseResponse {
  message: string;
}

export interface OrganizationItem {
  id: string;
  name: string;
  organization?: string;
  contact_email: string;
  email?: string;
  phone_number?: string | null;
  phone?: string | null;
  address?: string | null;
  description?: string | null;
  join_code?: string | null;
  created_at?: string | null;
}

export interface OrganizationListResponse {
  items: OrganizationItem[];
  pagination: PaginationMeta;
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

export interface OrganizationDeleteResponse {
  message: string;
}

export interface OrganizationListParams {
  page?: number;
  page_size?: number;
  search?: string;
}

export interface PlayerRoleSelectionCurrentResponse {
  success: boolean;
  message: string;
  status: string;
  description?: string | null;
  title: string;
  link?: string | null;
  error?: null;
  session_token: string;
  selected_role: string;
  role: string;
  id?: string | null;
}

export interface PlayerRoleSelectionParams {
  session_token: string;
}
