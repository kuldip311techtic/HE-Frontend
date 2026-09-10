export interface ApiErrorBody {
  success?: boolean;
  error?: string | null;
  message?: string;
  status?: string;
}

export interface SuperAdminDashboardResponse {
  total_organizations: number;
  total_coaches: number;
  total_players: number;
  total_sessions: number;
  active_subscriptions: number;
  revenue_overview: number;
}
