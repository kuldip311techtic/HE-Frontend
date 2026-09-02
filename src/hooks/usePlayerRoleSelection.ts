import { useQuery } from "@tanstack/react-query";
import { playerApi } from "@/lib/api/services/endpoints";

export function usePlayerRoleSelection(enabled = true) {
  return useQuery({
    queryKey: ["player", "role-selection"],
    queryFn: () => playerApi.roleSelection.get(),
    enabled,
    retry: false,
  });
}
