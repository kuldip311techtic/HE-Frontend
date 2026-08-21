export interface DashboardMetric {
  key: string;
  label: string;
  value: number;
}

export interface DashboardData {
  metrics: DashboardMetric[];
  updated_at: string;
}

export interface DashboardResponse {
  success: boolean;
  message: string;
  description: string;
  data: DashboardData;
}
