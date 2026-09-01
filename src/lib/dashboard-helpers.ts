import type { DashboardMetricsData } from "@/types/dashboard";

export interface MetricDefinition {
  key: keyof Omit<DashboardMetricsData, "links">;
  label: string;
  description: string;
  format: "number" | "currency";
}

export const DASHBOARD_METRICS: MetricDefinition[] = [
  {
    key: "total_organizations",
    label: "Total Organizations",
    description: "Registered organizations on the platform",
    format: "number",
  },
  {
    key: "total_coaches",
    label: "Total Coaches",
    description: "Active coaches across all organizations",
    format: "number",
  },
  {
    key: "total_players",
    label: "Total Players",
    description: "Registered players on the platform",
    format: "number",
  },
  {
    key: "total_sessions",
    label: "Total Sessions",
    description: "Training sessions recorded platform-wide",
    format: "number",
  },
  {
    key: "active_subscriptions",
    label: "Active Subscriptions",
    description: "Currently active subscription plans",
    format: "number",
  },
  {
    key: "revenue_overview",
    label: "Revenue Overview",
    description: "Total platform revenue to date",
    format: "currency",
  },
];

export const DEFAULT_MODULE_LINKS = [
  {
    link: "/super-admin/manage-organizations",
    description: "View and manage all organizations on the platform.",
    label: "Organizations",
  },
  {
    link: "/super-admin/manage-users",
    description: "Manage coaches and their platform access.",
    label: "Coaches",
  },
  {
    link: "/super-admin/manage-users",
    description: "View and manage player accounts.",
    label: "Players",
  },
  {
    link: "/super-admin/subscriptions",
    description: "Configure subscription plans and pricing.",
    label: "Subscriptions",
  },
] as const;

export function formatMetricValue(
  value: number,
  format: MetricDefinition["format"],
): string {
  if (format === "currency") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  }

  return new Intl.NumberFormat("en-US").format(value);
}

export function isDashboardEmpty(metrics: DashboardMetricsData): boolean {
  return DASHBOARD_METRICS.every(({ key }) => metrics[key] === 0);
}

export function exportDashboardMetricsToCsv(
  metrics: DashboardMetricsData,
  dateRange?: { startDate?: string; endDate?: string },
): void {
  const rows = [
    ["Metric", "Value"],
    ...DASHBOARD_METRICS.map(({ label, key, format }) => [
      label,
      formatMetricValue(metrics[key], format),
    ]),
  ];

  if (dateRange?.startDate || dateRange?.endDate) {
    rows.unshift(
      ["Date Range", `${dateRange.startDate ?? "—"} to ${dateRange.endDate ?? "—"}`],
    );
  }

  const csvContent = rows
    .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `dashboard-analytics-${new Date().toISOString().slice(0, 10)}.csv`;
  anchor.click();
  URL.revokeObjectURL(url);
}
