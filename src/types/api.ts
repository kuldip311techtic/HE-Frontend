export interface ApiErrorBody {
  message?: string;
  detail?: string;
  error?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    total: number;
  };
}

export interface Organization {
  id: string;
  name: string;
  contact_email: string;
  phone_number: string;
  address: string;
  join_code: string;
}

export interface OrganizationProfile {
  organization_name: string;
  name: string;
  description: string;
  contact_info: string;
  first_name: string;
  last_name: string;
}

export interface SuperAdminDashboard {
  total_organizations: number;
  total_coaches: number;
  total_players: number;
  total_sessions: number;
  active_subscriptions: number;
  revenue_overview: number;
  description: string | null;
  link: string | null;
  error: string | null;
}
