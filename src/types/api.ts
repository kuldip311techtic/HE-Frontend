export interface ApiErrorDetail {
  code: string;
  message: string;
  details?: Array<{ field: string; message: string }>;
}

export interface ApiErrorEnvelope {
  success: false;
  error: ApiErrorDetail;
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
