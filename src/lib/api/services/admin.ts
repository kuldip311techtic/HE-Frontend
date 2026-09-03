import { apiGet, apiPost, apiPut } from "@/lib/api/client";
import type { OrganizationProfile } from "@/types/api";

export async function getOrganizationProfile(): Promise<{
  success: boolean;
  profile: OrganizationProfile;
}> {
  return apiGet("/v1/organization/profile");
}

export async function updateOrganizationProfile(
  data: Partial<OrganizationProfile>,
): Promise<{ success: boolean; message: string }> {
  return apiPut("/v1/organization/profile", data);
}

export async function createTeam(data: {
  team_name: string;
  age_group: string;
  coaches?: { id: string }[];
  players?: { id: string }[];
}): Promise<{ id: string; team_name: string; age_group: string }> {
  return apiPost("/v1/admin/teams", data);
}

export async function inviteCoach(data: {
  email: string;
  phone?: string;
  company?: string;
}): Promise<{ success: boolean; message: string }> {
  return apiPost("/v1/admin/invite-coach", data);
}

export { getSuperAdminDashboard } from "@/lib/api/services/super-admin";
