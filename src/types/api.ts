export interface LoginRequest {
  email: string;
  password: string;
}

export interface Subscription {
  status: string;
  has_access: boolean;
  access_until: null;
}

export interface LoginData {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  email: string;
  password: string;
  description: string;
  message: string;
  error: null;
  redirect_to: string;
  subscription: Subscription;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: LoginData;
}

export interface HealthData {
  status: string;
  email: string;
  password: string;
  description: string;
  message: string;
  error: null;
}

export interface HealthResponse {
  success: boolean;
  message: string;
  data: HealthData;
}

export interface ErrorDetails {
  [key: string]: unknown;
}

export interface ErrorBody {
  code: string;
  details: ErrorDetails | null;
}

export interface ErrorResponse {
  success: boolean;
  message: string;
  error: ErrorBody;
}

export interface RevenueOverview {
  total: number | null;
  currency: string | null;
}

export interface DashboardData {
  total_organizations: number | null;
  total_coaches: number | null;
  total_players: number | null;
  total_sessions: number | null;
  active_subscriptions: number | null;
  revenue_overview: RevenueOverview;
}

export interface DashboardResponse {
  success: boolean;
  message: string;
  data: DashboardData;
}

export interface DashboardDateRange {
  from: string;
  to: string;
}

export type AdminRole = "admin" | "super_admin";
