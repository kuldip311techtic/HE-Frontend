import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { ApiClientError } from "@/services/api-client";
import { getDashboard } from "@/services/dashboard";
import type { DashboardResponse } from "@/types/super-admin";

interface UseDashboardOptions {
  enabled?: boolean;
}

interface UseDashboardResult {
  data: DashboardResponse | null;
  isLoading: boolean;
  error: string | null;
  refetch: (showToast?: boolean) => Promise<void>;
}

export function useDashboard(
  options: UseDashboardOptions = {}
): UseDashboardResult {
  const { enabled = true } = options;
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async (showToast = false) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getDashboard();
      setData(response);
      if (showToast) {
        toast.success("Dashboard refreshed successfully.");
      }
    } catch (err) {
      const message =
        err instanceof ApiClientError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Failed to load dashboard.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let cancelled = false;

    async function load() {
      try {
        const response = await getDashboard();
        if (!cancelled) {
          setData(response);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          const message =
            err instanceof ApiClientError
              ? err.message
              : err instanceof Error
                ? err.message
                : "Failed to load dashboard.";
          setError(message);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return { data, isLoading, error, refetch };
}
