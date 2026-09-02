import type { SuperAdminProfile } from "@/types/api";
import type { AuthUser } from "@/types/auth";

export function mapSuperAdminProfileToAuthUser(
  profile: SuperAdminProfile,
): AuthUser {
  const nameParts = profile.name.trim().split(/\s+/);
  const firstName = nameParts[0] ?? "Super";
  const lastName = nameParts.slice(1).join(" ") || "Admin";

  return {
    id: profile.id,
    email: profile.email,
    firstName,
    lastName,
    role: "super_admin",
    roles: ["super_admin"],
  };
}
