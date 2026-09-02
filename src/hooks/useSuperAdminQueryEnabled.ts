import { useAuth } from "@/hooks/useAuth";

export function useSuperAdminQueryEnabled(): boolean {
  const { user, isAuthenticated, hasAdminAccess, isLoading } = useAuth();
  const isSuperAdmin =
    user?.role === "super_admin" ||
    user?.roles.includes("super_admin") === true;

  return !isLoading && isAuthenticated && hasAdminAccess && isSuperAdmin;
}
