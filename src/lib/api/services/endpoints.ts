import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api/client";

/** Coach endpoints */
export const coachApi = {
  clearCache: (cache_type: string) =>
    apiPost<{ clear_status: string }>("/v1/coach/clear-cache", { cache_type }),
  sync: (phone: string) =>
    apiPost<{ sync_status: string }>("/v1/coach/sync", { phone }),
  home: () =>
    apiGet<{
      total_sessions: number;
      total_players: number;
      recent_activities: unknown[];
      attendance_records: unknown[];
    }>("/v1/coach/home"),
  cancelVerification: (data: { cancel_verification: boolean; phone: string }) =>
    apiPost<{ success: boolean; status: string; message: string }>(
      "/v1/coach/cancel-verification",
      data,
    ),
  continueVerification: (otp_code: string) =>
    apiPost<{ success: boolean; message: string }>(
      "/v1/coach/continue-verification",
      { otp_code },
    ),
  createPracticePlan: (data: unknown) =>
    apiPost("/v1/coach/practice-plans", data),
};

/** Session endpoints */
export const sessionApi = {
  record: (data: {
    session_mode: string;
    session_details: { description: string };
    phone: string;
  }) =>
    apiPost<{
      success: boolean;
      session_mode: string;
      id: string;
      error: null;
    }>("/v1/sessions/record", data),
  get: (sessionId: string) => apiGet(`/v1/sessions/${sessionId}`),
  nextDrill: (sessionId: string, data?: unknown) =>
    apiPost(`/v1/sessions/${sessionId}/next-drill`, data),
  end: (sessionId: string, data?: unknown) =>
    apiPost(`/v1/sessions/${sessionId}/end-practice`, data),
};

/** Drill endpoints */
export const drillApi = {
  list: () =>
    apiGet<{ success: boolean; drills: { id: string; name: string }[] }>(
      "/drills",
    ),
  create: (data: { drill_name: string; drill_category: string }) =>
    apiPost<{ success: boolean; id: string }>("/drills", data),
  delete: (id: string) =>
    apiDelete<{ success: boolean }>(`/drills/${id}`),
  searchPlayers: (data: {
    search_query?: string;
    full_name?: string;
    phone?: string;
  }) =>
    apiPost<{
      success: boolean;
      error: null;
      search_query: string;
      players: { name: string }[];
    }>("/v1/coach/drills/search", data),
  selectPlayer: (data: {
    selected_player_id: string;
    full_name?: string;
    phone?: string;
  }) =>
    apiPost<{
      success: boolean;
      selected_player_id: string;
      link: string;
      error: null;
    }>("/v1/coach/drills/select_player", data),
};

/** Player endpoints */
export const playerApi = {
  drills: () =>
    apiGet<{
      success: boolean;
      drills: {
        drill_id: string;
        status: string;
        time_remaining: string;
      }[];
    }>("/player/drills"),
  startDrill: (phone: string) =>
    apiPost<{
      success: boolean;
      status: string;
      time_remaining: string;
      drill_id: string;
    }>("/player/drills/start", { phone }),
  playDrill: (id: string, phone: string) =>
    apiPost<{
      success: boolean;
      id: string;
      status: string;
      timer: string;
      progress: number;
    }>(`/player/drills/${id}/play`, { phone }),
  updateTimer: (id: string, timer: string) =>
    apiPut<{ success: boolean; status: string; time_remaining: string }>(
      `/player/drills/${id}/timer`,
      { timer },
    ),
  myProgress: () =>
    apiGet<{
      success: boolean;
      error: null;
      status: string;
      id: string;
      name: string;
      completed_sessions: number;
      total_attempts: number;
      makes: number;
      shooting_percentage: string;
      phone: string;
    }>("/player/my-progress"),
  roleSelection: {
    get: () =>
      apiGet<{
        success: boolean;
        selected_role: string;
        role: string;
        session_token: string;
      }>("/v1/player/role-selection"),
    post: (data: { selected_role: string; phone: string }) =>
      apiPost("/v1/player/role-selection", data),
  },
  submitDrill: (data: unknown) => apiPost("/player/drill-submissions", data),
  resetDrills: (data?: unknown) => apiPost("/player/drills/reset", data),
};

/** Practice plan endpoints */
export const practicePlanApi = {
  list: () =>
    apiGet<{ plans: unknown[] }>("/practice-plans"),
  create: (data: unknown) => apiPost("/practice-plans", data),
};

/** Support endpoints */
export const supportApi = {
  contact: (data: unknown) => apiPost("/v1/support/contact", data),
  inquiries: (data: unknown) => apiPost("/support/inquiries", data),
};

/** Verification endpoints */
export const verificationApi = {
  resendCode: (data: unknown) =>
    apiPost("/v1/verification/resend-verification-code", data),
  verifyEmail: (data: unknown) =>
    apiPost("/v1/verification/verify-email", data),
  resetPassword: (data: unknown) =>
    apiPost("/v1/reset-password", data),
};

/** Super admin endpoints */
export const superAdminApi = {
  organizations: {
    list: () => apiGet("/v1/super-admin/organizations"),
    create: (data: unknown) => apiPost("/v1/super-admin/organizations", data),
  },
  users: {
    list: () => apiGet("/v1/super-admin/users"),
    create: (data: unknown) => apiPost("/v1/super-admin/users", data),
  },
  dashboard: () => apiGet("/v1/super-admin/dashboard"),
};
