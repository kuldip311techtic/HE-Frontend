export interface ApiErrorDetail {
  field: string;
  message: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: ApiErrorDetail[];
}

export interface PaginationMeta {
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface SuperAdminDashboardMetrics {
  total_organizations: number;
  total_coaches: number;
  total_players: number;
  total_sessions: number;
  active_subscriptions: number;
  revenue_overview: number;
  description?: string | null;
  link?: string | null;
  error?: ApiError | null;
}

export interface QuickAccessItem {
  module?: string | null;
  name?: string | null;
  label?: string | null;
  description?: string | null;
  link?: string | null;
  to?: string | null;
  path?: string | null;
  status?: string | null;
}

export interface QuickAccessResponse {
  items: QuickAccessItem[];
}
