export interface ErrorDetail {
  code: string;
  message: string;
  details?: Array<{ field?: string; message: string }> | null;
}

export interface ErrorResponse {
  success: false;
  error: ErrorDetail;
}

export interface QuickAccessLinkItem {
  module: string;
  link: string;
}

export interface DashboardAnalyticsResponse {
  total_organizations: number;
  total_coaches: number;
  total_players: number;
  total_sessions: number;
  active_subscriptions: number;
  revenue_overview: number;
  description: string | null;
  link: string | null;
  error: unknown | null;
}
