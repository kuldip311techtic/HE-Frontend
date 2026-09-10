export interface ApiErrorBody {
  success?: boolean;
  error?: string | null;
  message?: string;
  status?: string;
}

export interface PaginationMeta {
  page: number;
  total: number;
}

export interface SuperAdminLoginRequest {
  email: string;
  password: string;
}

export interface SuperAdminLoginResponse {
  token?: string;
  access_token?: string;
  jwt?: string;
  role?: string;
  email?: string;
  name?: string;
  message?: string;
}

export interface SuperAdminDashboardResponse {
  total_organizations: number;
  total_coaches: number;
  total_players: number;
  total_sessions: number;
  active_subscriptions: number;
  revenue_overview: number;
  description?: string | null;
  link?: string | null;
  error?: string | null;
}

export interface Organization {
  id: string;
  name: string;
  contact_email: string;
  phone_number: string;
  address: string;
  join_code?: string;
}

export interface OrganizationListResponse {
  items: Organization[];
  pagination: PaginationMeta;
}

export interface CreateOrganizationRequest {
  name: string;
  contact_email: string;
  phone_number: string;
  address: string;
}

export interface CreateOrganizationResponse extends Organization {
  message: string;
}

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  name: string;
  email: string;
  role: string;
  roles?: string[];
  is_self?: boolean;
  is_active?: boolean;
}

export interface UserListResponse {
  items: User[];
  pagination: PaginationMeta;
}

export interface CreateUserRequest {
  first_name: string;
  last_name: string;
  email: string;
  password?: string;
  role: string;
}

export interface CreateUserResponse extends User {
  message: string;
  is_active: boolean;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  billing_cycle: string;
  status?: string;
  description?: string;
}

export interface SubscriptionListResponse {
  items: SubscriptionPlan[];
}

export interface CreateSubscriptionRequest {
  name: string;
  price: number;
  billing_cycle: string;
}

export interface SupportRequest {
  id: string;
  request_id?: string;
  user?: string;
  email?: string;
  name?: string;
  request_date?: string;
  created_at?: string;
  status?: string;
  message?: string;
  inquiry_subject?: string;
  message_description?: string;
}

export interface SupportRequestListResponse {
  items: SupportRequest[];
}

export interface RespondSupportRequestBody {
  request_id: string;
  response: string;
}
