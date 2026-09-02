import { apiGet, apiPost } from "@/lib/api/client";
import type {
  OrganizationProfile,
  PaginatedResponse,
  Organization,
  SuperAdminDashboard,
} from "@/types/api";

export async function getOrganizationProfile(): Promise<{
  success: boolean;
  profile: OrganizationProfile;
}> {
  return apiGet("/organization/profile");
}

export async function updateOrganizationProfile(
  data: Partial<OrganizationProfile>,
): Promise<{ success: boolean; message: string }> {
  return apiPost("/organization/profile", data);
}

export async function createTeam(data: {
  team_name: string;
  age_group: string;
  coaches?: { id: string }[];
  players?: { id: string }[];
}): Promise<{ id: string; team_name: string; age_group: string }> {
  return apiPost("/admin/teams", data);
}

export async function inviteCoach(data: {
  email: string;
  phone?: string;
  company?: string;
}): Promise<{ success: boolean; message: string }> {
  return apiPost("/admin/invite-coach", data);
}

export async function getSuperAdminDashboard(): Promise<SuperAdminDashboard> {
  return apiGet("/api/v1/super-admin/dashboard");
}

export async function getOrganizations(): Promise<
  PaginatedResponse<Organization>
> {
  return apiGet("/super-admin/organizations");
}

export async function getSuperAdminUsers(): Promise<
  PaginatedResponse<{
    id: string;
    first_name: string;
    last_name: string;
    name: string;
    email: string;
    role: string;
    roles: string[];
    is_self: boolean;
  }>
> {
  return apiGet("/super-admin/users");
}
