import { useQuery } from "@tanstack/react-query";
import { sessionApi } from "@/lib/api/services/endpoints";

export function useSessionDetail(sessionId: string | null | undefined) {
  return useQuery({
    queryKey: ["session", sessionId],
    queryFn: () => sessionApi.get(sessionId!),
    enabled: Boolean(sessionId),
    retry: false,
  });
}
