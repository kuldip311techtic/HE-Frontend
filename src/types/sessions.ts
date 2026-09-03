/** GET /sessions/{session_id} — session detail (subset) */
export interface SessionDetailResponse {
  id: string;
  status?: string;
  [key: string]: unknown;
}
