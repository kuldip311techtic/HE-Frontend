import { useAuth } from "@/hooks/useAuth";

export function useIsSuperAdmin(): boolean {
  const { user } = useAuth();
  return (
    user?.role === "super_admin" ||
    user?.roles?.includes("super_admin") === true
  );
}
