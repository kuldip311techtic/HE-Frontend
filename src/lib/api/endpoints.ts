import { apiClient } from "@/lib/apiClient";
import {
  parseDashboardResponse,
  parseHealthResponse,
  parseLoginResponse,
} from "@/lib/api/parse";
import type {
  DashboardDateRange,
  DashboardResponse,
  HealthResponse,
  LoginRequest,
  LoginResponse,
} from "@/types/api";

export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  const payload = await apiClient("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
  return parseLoginResponse(payload);
}

export async function getHealth(): Promise<HealthResponse> {
  const payload = await apiClient("/health", { method: "GET" });
  return parseHealthResponse(payload);
}

export async function getHealthReady(): Promise<HealthResponse> {
  const payload = await apiClient("/health/ready", { method: "GET" });
  return parseHealthResponse(payload);
}

export async function getDashboard(
  range?: DashboardDateRange,
): Promise<DashboardResponse> {
  const params = new URLSearchParams();
  if (range) {
    params.set("from", range.from);
    params.set("to", range.to);
  }
  const query = params.toString();
  const path = query ? `/dashboard?${query}` : "/dashboard";
  const payload = await apiClient(path, { method: "GET" });
  return parseDashboardResponse(payload);
}
