import { ApiError } from "@/lib/api/errors";
import type {
  DashboardData,
  DashboardResponse,
  ErrorDetails,
  ErrorResponse,
  HealthResponse,
  LoginResponse,
  RevenueOverview,
} from "@/types/api";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readString(record: Record<string, unknown>, key: string): string {
  const value = record[key];
  if (typeof value !== "string") {
    throw new ApiError(`Invalid response field: ${key}`, 500);
  }
  return value;
}

function readNumber(record: Record<string, unknown>, key: string): number {
  const value = record[key];
  if (typeof value !== "number") {
    throw new ApiError(`Invalid response field: ${key}`, 500);
  }
  return value;
}

function readBoolean(record: Record<string, unknown>, key: string): boolean {
  const value = record[key];
  if (typeof value !== "boolean") {
    throw new ApiError(`Invalid response field: ${key}`, 500);
  }
  return value;
}

export function parseLoginResponse(value: unknown): LoginResponse {
  if (!isRecord(value)) {
    throw new ApiError("Invalid login response", 500);
  }

  const data = value.data;
  if (!isRecord(data)) {
    throw new ApiError("Invalid login response data", 500);
  }

  const subscription = data.subscription;
  if (!isRecord(subscription)) {
    throw new ApiError("Invalid login subscription", 500);
  }

  return {
    success: readBoolean(value, "success"),
    message: readString(value, "message"),
    data: {
      access_token: readString(data, "access_token"),
      refresh_token: readString(data, "refresh_token"),
      token_type: readString(data, "token_type"),
      expires_in: readNumber(data, "expires_in"),
      email: readString(data, "email"),
      password: readString(data, "password"),
      description: readString(data, "description"),
      message: readString(data, "message"),
      error: null,
      redirect_to: readString(data, "redirect_to"),
      subscription: {
        status: readString(subscription, "status"),
        has_access: readBoolean(subscription, "has_access"),
        access_until: null,
      },
    },
  };
}

export function parseHealthResponse(value: unknown): HealthResponse {
  if (!isRecord(value)) {
    throw new ApiError("Invalid health response", 500);
  }

  const data = value.data;
  if (!isRecord(data)) {
    throw new ApiError("Invalid health response data", 500);
  }

  return {
    success: readBoolean(value, "success"),
    message: readString(value, "message"),
    data: {
      status: readString(data, "status"),
      email: readString(data, "email"),
      password: readString(data, "password"),
      description: readString(data, "description"),
      message: readString(data, "message"),
      error: null,
    },
  };
}

function readOptionalFiniteNumber(
  record: Record<string, unknown>,
  key: string,
): number | null {
  const value = record[key];
  if (value === null || value === undefined) {
    return null;
  }
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new ApiError(`Invalid response field: ${key}`, 500);
  }
  return value;
}

function readRevenueOverview(data: Record<string, unknown>): RevenueOverview {
  const value = data.revenue_overview;
  if (value === null || value === undefined) {
    return { total: null, currency: null };
  }
  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      throw new ApiError("Invalid response field: revenue_overview", 500);
    }
    return { total: value, currency: null };
  }
  if (!isRecord(value)) {
    throw new ApiError("Invalid response field: revenue_overview", 500);
  }

  const currencyValue = value.currency;
  const currency =
    typeof currencyValue === "string" && currencyValue.length > 0
      ? currencyValue
      : null;

  return {
    total: readOptionalFiniteNumber(value, "total"),
    currency,
  };
}

export function parseDashboardResponse(value: unknown): DashboardResponse {
  if (!isRecord(value)) {
    throw new ApiError("Invalid dashboard response", 500);
  }

  const data = value.data;
  if (!isRecord(data)) {
    throw new ApiError("Invalid dashboard response data", 500);
  }

  const parsedData: DashboardData = {
    total_organizations: readOptionalFiniteNumber(data, "total_organizations"),
    total_coaches: readOptionalFiniteNumber(data, "total_coaches"),
    total_players: readOptionalFiniteNumber(data, "total_players"),
    total_sessions: readOptionalFiniteNumber(data, "total_sessions"),
    active_subscriptions: readOptionalFiniteNumber(
      data,
      "active_subscriptions",
    ),
    revenue_overview: readRevenueOverview(data),
  };

  return {
    success: readBoolean(value, "success"),
    message: readString(value, "message"),
    data: parsedData,
  };
}

export function parseErrorResponse(value: unknown): ErrorResponse | null {
  if (!isRecord(value) || typeof value.message !== "string") {
    return null;
  }

  const error = value.error;
  if (!isRecord(error) || typeof error.code !== "string") {
    return null;
  }

  const details = error.details;
  const parsedDetails: ErrorDetails | null =
    details === null ? null : isRecord(details) ? details : null;

  return {
    success: typeof value.success === "boolean" ? value.success : false,
    message: value.message,
    error: {
      code: error.code,
      details: parsedDetails,
    },
  };
}
