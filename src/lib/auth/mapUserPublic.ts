import type { UserPublic } from "@/types/api";
import type { AuthUser, UserRole } from "@/types/auth";

export function mapUserPublicToAuthUser(user: UserPublic): AuthUser {
  const role = (user.is_super_admin ? "super_admin" : user.role) as UserRole;
  return {
    id: user.id,
    email: user.email,
    firstName: user.first_name ?? "Super",
    lastName: user.last_name ?? "Admin",
    role,
    roles: [role],
  };
}
