import { apiClient, apiPost } from "@/lib/api/client";

export interface PlayerRoleSelectionResponse {
  success: boolean;
  message?: string;
  status?: string;
  session_token: string;
  selected_role: string;
  role: string;
  id: string;
}

export async function submitPlayerRoleSelection(
  selectedRole: string,
): Promise<PlayerRoleSelectionResponse> {
  return apiPost<PlayerRoleSelectionResponse, { selected_role: string }>(
    "/v1/player/role-selection",
    { selected_role: selectedRole },
  );
}

export async function getPlayerRoleSelection(
  sessionToken: string,
): Promise<PlayerRoleSelectionResponse> {
  const response = await apiClient.get<PlayerRoleSelectionResponse>(
    "/v1/player/role-selection",
    { params: { session_token: sessionToken } },
  );
  return response.data;
}
