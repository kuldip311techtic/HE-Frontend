export interface DashboardLink {
  link: string;
  description: string;
}

export interface DashboardMetrics {
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
  email: string | null;
  token: string | null;
  data: DashboardMetrics;
  description: string;
  error: null;
}
