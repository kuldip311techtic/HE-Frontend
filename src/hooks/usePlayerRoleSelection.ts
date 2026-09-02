import { useQuery } from "@tanstack/react-query";
import { playerApi } from "@/lib/api/services/endpoints";

export function usePlayerRoleSelection(
  sessionToken: string | null | undefined,
  enabled = true,
) {
  return useQuery({
    queryKey: ["player", "role-selection", sessionToken],
    queryFn: () => playerApi.roleSelection.get(sessionToken!),
    enabled: enabled && Boolean(sessionToken),
    retry: false,
  });
}
