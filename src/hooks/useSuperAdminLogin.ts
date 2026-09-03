import { useMutation } from "@tanstack/react-query";
import { superAdminLogin } from "@/lib/api/services/auth";

export function useSuperAdminLogin() {
  return useMutation({
    mutationFn: superAdminLogin,
  });
}
