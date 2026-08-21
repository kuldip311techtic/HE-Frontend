import type { DashboardDateRange } from "@/types/api";

export const queryKeys = {
  health: ["health"] as const,
  healthReady: ["health", "ready"] as const,
  dashboard: (range?: DashboardDateRange) =>
    range ? (["dashboard", range] as const) : (["dashboard"] as const),
};
