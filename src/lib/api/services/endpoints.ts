import { apiGet } from "@/lib/api/client";

/** Minimal player endpoints used by Luna validation probes */
export const playerApi = {
  roleSelection: {
    get: (sessionToken: string) =>
      apiGet<{
        success: boolean;
        selected_role: string;
        role: string;
        session_token: string;
      }>(
        `/v1/player/role-selection?session_token=${encodeURIComponent(sessionToken)}`,
      ),
  },
};

/** Session endpoints used by Luna validation probes */
export const sessionApi = {
  get: (sessionId: string) =>
    apiGet<Record<string, unknown>>(`/v1/sessions/${encodeURIComponent(sessionId)}`),
};
