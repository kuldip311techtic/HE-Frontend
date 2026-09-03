import { useQuery } from "@tanstack/react-query";
import { sessionApi } from "@/lib/api/services/endpoints";

/** Issues GET /v1/sessions/{session_id} during Luna validation (AdminContractProbes). */
export function useSessionDetailContractProbe(
  sessionId: string | null | undefined,
  enabled = false,
) {
  return useQuery({
    queryKey: ["contract-probe", "session", sessionId],
    queryFn: () => sessionApi.get(sessionId!),
    enabled: enabled && Boolean(sessionId),
    retry: false,
  });
}
