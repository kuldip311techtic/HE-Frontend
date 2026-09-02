export interface DashboardLink {
  link: string;
  description: string;
}

export interface DashboardMetricsData {
  total_organizations: number;
  total_coaches: number;
  total_players: number;
  total_sessions: number;
  active_subscriptions: number;
  revenue_overview: number;
  links: DashboardLink[];
}

export interface DashboardResponse {
  success: boolean;
  message: string;
  description?: string;
  email: null;
  token: null;
  error: null;
  data?: DashboardMetricsData;
}

export interface DashboardQueryParams {
  start_date?: string;
  end_date?: string;
}
