export interface DashboardData {
  total_organizations: number;
  total_coaches: number;
  total_players: number;
  total_sessions: number;
  active_subscriptions: number;
  revenue_overview: number;
  description: string | null;
  link: string | null;
  error: Record<string, unknown> | null;
}

export function isDashboardEmpty(data: DashboardData): boolean {
  return (
    data.total_organizations === 0 &&
    data.total_coaches === 0 &&
    data.total_players === 0 &&
    data.total_sessions === 0 &&
    data.active_subscriptions === 0 &&
    data.revenue_overview === 0
  );
}
