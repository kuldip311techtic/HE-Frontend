import { DEMO_AUTH_TOKEN } from "@/lib/auth/storage";
import type { AuthUser, UserRole } from "@/types/auth";
import { isAdminRole } from "@/types/auth";

const DEMO_PROFILES: Record<
  UserRole,
  Pick<AuthUser, "firstName" | "lastName">
> = {
  super_admin: { firstName: "Super", lastName: "Admin" },
  organization_admin: { firstName: "Organization", lastName: "Admin" },
  admin: { firstName: "Admin", lastName: "User" },
  coach: { firstName: "Demo", lastName: "Coach" },
  player: { firstName: "Demo", lastName: "Player" },
};

export function createDemoAuthUser(
  role: UserRole,
  email?: string,
): AuthUser {
  const profile = DEMO_PROFILES[role];

  return {
    id: `demo-${role}`,
    email: email?.trim() || `demo-${role.replace(/_/g, "-")}@hoopsengine.com`,
    firstName: profile.firstName,
    lastName: profile.lastName,
    role,
    roles: [role],
  };
}

export function getDemoAuthToken(): string {
  return DEMO_AUTH_TOKEN;
}

export function isDemoAdminRole(role: UserRole): boolean {
  return isAdminRole(role);
}
