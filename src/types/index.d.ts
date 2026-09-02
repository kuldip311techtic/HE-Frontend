export type UserRole =
  | 'super_admin'
  | 'admin'
  | 'coach'
  | 'player'
  | 'organization';

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  name: string;
  role: UserRole;
  roles: UserRole[];
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface ApiErrorEnvelope {
  success?: boolean;
  error: {
    code: string;
    message: string;
    details?: unknown[];
  };
}

export interface DashboardData {
  total_organizations: number;
  total_coaches: number;
  total_players: number;
  total_sessions: number;
  active_subscriptions: number;
  revenue_overview: number;
  description: string | null;
  link: string | null;
  error: unknown | null;
}

export interface ApiRequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined>;
}
