import { useCallback, useEffect, useState } from "react";

import { ApiClientError } from "@/services/api-client";
import {
  closeSupportRequest,
  listSupportRequests,
  respondToSupportRequest,
} from "@/services/support-requests";
import type { SupportRequest } from "@/types/super-admin";

interface UseSupportRequestsResult {
  supportRequests: SupportRequest[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  respond: (id: string, response: string) => Promise<SupportRequest>;
  close: (id: string) => Promise<SupportRequest>;
  isMutating: boolean;
}

export function useSupportRequests(): UseSupportRequestsResult {
  const [supportRequests, setSupportRequests] = useState<SupportRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await listSupportRequests();
      setSupportRequests(data);
    } catch (err) {
      const message =
        err instanceof ApiClientError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Failed to load support requests.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  const respond = useCallback(
    async (id: string, response: string) => {
      setIsMutating(true);
      try {
        const updated = await respondToSupportRequest({ id, response });
        await refetch();
        return updated;
      } finally {
        setIsMutating(false);
      }
    },
    [refetch]
  );

  const close = useCallback(
    async (id: string) => {
      setIsMutating(true);
      try {
        const updated = await closeSupportRequest(id);
        await refetch();
        return updated;
      } finally {
        setIsMutating(false);
      }
    },
    [refetch]
  );

  return {
    supportRequests,
    isLoading,
    error,
    refetch,
    respond,
    close,
    isMutating,
  };
}
