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

/** Live OpenAPI response from GET /api/v1/super-admin/dashboard */
export interface SuperAdminDashboardApiResponse {
  total_organizations: number;
  total_coaches: number;
  total_players: number;
  total_sessions: number;
  active_subscriptions: number;
  revenue_overview: number;
  description: string | null;
  link: string | null;
  error: null;
}

export interface DashboardData {
  metrics: DashboardMetricsData;
  description: string | null;
}

export interface DashboardQueryParams {
  start_date?: string;
  end_date?: string;
}
