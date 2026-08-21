import { useQuery } from "@tanstack/react-query";

import { getDashboard } from "@/lib/api/endpoints";
import { queryKeys } from "@/lib/api/queryKeys";
import { ApiError } from "@/lib/apiClient";
import type { DashboardData, DashboardDateRange } from "@/types/api";

export interface DashboardMetricCard {
  id: string;
  label: string;
  value: number | null;
  kind: "count" | "revenue";
  currency: string | null;
}

export function toDashboardMetricCards(
  data: DashboardData,
): DashboardMetricCard[] {
  return [
    {
      id: "total-organizations",
      label: "Total Organizations",
      value: data.total_organizations,
      kind: "count",
      currency: null,
    },
    {
      id: "total-coaches",
      label: "Total Coaches",
      value: data.total_coaches,
      kind: "count",
      currency: null,
    },
    {
      id: "total-players",
      label: "Total Players",
      value: data.total_players,
      kind: "count",
      currency: null,
    },
    {
      id: "total-sessions",
      label: "Total Sessions",
      value: data.total_sessions,
      kind: "count",
      currency: null,
    },
    {
      id: "active-subscriptions",
      label: "Active Subscriptions",
      value: data.active_subscriptions,
      kind: "count",
      currency: null,
    },
    {
      id: "revenue-overview",
      label: "Revenue Overview",
      value: data.revenue_overview.total,
      kind: "revenue",
      currency: data.revenue_overview.currency,
    },
  ];
}

export function useDashboardMetrics(range?: DashboardDateRange | null) {
  const appliedRange = range ?? undefined;

  const query = useQuery({
    queryKey: queryKeys.dashboard(appliedRange),
    queryFn: () => getDashboard(appliedRange),
  });

  const cards = query.data ? toDashboardMetricCards(query.data.data) : [];
  const hasAnyValue = cards.some((card) => card.value !== null);
  const isSuccess = query.isSuccess && query.data.success;
  const isEmpty = isSuccess && !hasAnyValue;

  return {
    isLoading: query.isPending,
    isError: query.isError || (query.isSuccess && !query.data.success),
    isSuccess,
    isEmpty,
    errorMessage: toErrorMessage(
      query.error,
      query.data && !query.data.success ? query.data.message : null,
    ),
    data: query.data?.data ?? null,
    cards,
  };
}

function toErrorMessage(
  error: unknown,
  fallbackMessage: string | null,
): string | null {
  if (error instanceof ApiError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  if (fallbackMessage) {
    return fallbackMessage;
  }
  return error ? "Unable to load dashboard data." : null;
}
