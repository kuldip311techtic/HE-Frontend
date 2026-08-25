export interface DashboardResponse {
  success: boolean;
  message: string;
  description?: string;
  data?: Record<string, unknown>;
}
