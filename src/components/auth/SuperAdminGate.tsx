import { RoleGate } from "@/components/auth/RoleGate";

export function SuperAdminGate({ children }: { children: React.ReactNode }) {
  return (
    <RoleGate allowedRoles={["super_admin"]}>{children}</RoleGate>
  );
}
