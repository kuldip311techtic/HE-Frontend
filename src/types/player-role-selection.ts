/** GET /api/v1/player/role-selection — RoleSelectionCurrentResponse (subset) */
export interface PlayerRoleSelectionResponse {
  session_token: string;
  role: string | null;
}
