export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token?: string
  access_token?: string
  message?: string
}

export interface AuthState {
  token: string | null
  isAuthenticated: boolean
}

export interface SuperAdminDashboardResponse {
  total_organizations: number
  total_coaches: number
  total_players: number
  total_sessions: number
  active_subscriptions: number
  revenue_overview: number
  description: string | null
  link: string | null
  error: string | null
}
