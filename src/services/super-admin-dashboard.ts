import { apiRequest } from "@/services/api-client";
import type {
  DashboardData,
  DashboardLink,
  DashboardMetricsData,
  DashboardQueryParams,
  SuperAdminDashboardApiResponse,
} from "@/types/dashboard";

const SUPER_ADMIN_DASHBOARD_PATH = "/api/v1/super-admin/dashboard";

function buildDashboardQuery(params?: DashboardQueryParams): string {
  if (!params) {
    return "";
  }

  const searchParams = new URLSearchParams();

  if (params.start_date) {
    searchParams.set("start_date", params.start_date);
  }

  if (params.end_date) {
    searchParams.set("end_date", params.end_date);
  }

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

function isMetricsRecord(
  value: unknown,
): value is Record<keyof DashboardMetricsData, unknown> & {
  links?: DashboardLink[];
} {
  return (
    typeof value === "object" &&
    value !== null &&
    "total_organizations" in value
  );
}

function normalizeMetrics(
  record: Record<string, unknown>,
): DashboardMetricsData {
  return {
    total_organizations: Number(record.total_organizations ?? 0),
    total_coaches: Number(record.total_coaches ?? 0),
    total_players: Number(record.total_players ?? 0),
    total_sessions: Number(record.total_sessions ?? 0),
    active_subscriptions: Number(record.active_subscriptions ?? 0),
    revenue_overview: Number(record.revenue_overview ?? 0),
    links: Array.isArray(record.links) ? (record.links as DashboardLink[]) : [],
  };
}

function normalizeDashboardResponse(body: unknown): DashboardData {
  if (typeof body !== "object" || body === null) {
    throw new Error("Invalid dashboard response.");
  }

  const record = body as Record<string, unknown>;

  if (isMetricsRecord(record.data)) {
    return {
      metrics: normalizeMetrics(record.data as Record<string, unknown>),
      description:
        typeof record.description === "string" ? record.description : null,
    };
  }

  if (isMetricsRecord(record)) {
    const apiResponse = record as unknown as SuperAdminDashboardApiResponse;
    return {
      metrics: normalizeMetrics(record),
      description: apiResponse.description ?? null,
    };
  }

  throw new Error("Invalid dashboard response.");
}

export async function fetchSuperAdminDashboard(
  params?: DashboardQueryParams,
): Promise<DashboardData> {
  const response = await apiRequest<
    SuperAdminDashboardApiResponse | { data: DashboardMetricsData }
  >(`${SUPER_ADMIN_DASHBOARD_PATH}${buildDashboardQuery(params)}`, {
    method: "GET",
    auth: true,
  });

  return normalizeDashboardResponse(response);
}
