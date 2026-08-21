import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ReactNode } from "react";

import { DashboardPage } from "@/pages/DashboardPage";
import { getDashboard } from "@/lib/api/endpoints";
import { ApiError } from "@/lib/apiClient";
import type { DashboardResponse } from "@/types/api";

vi.mock("@/lib/api/endpoints", () => ({
  getDashboard: vi.fn(),
}));

const mockedGetDashboard = vi.mocked(getDashboard);

const successResponse: DashboardResponse = {
  success: true,
  message: "Dashboard loaded",
  data: {
    total_organizations: 12,
    total_coaches: 4,
    total_players: 80,
    total_sessions: 19,
    active_subscriptions: 7,
    revenue_overview: { total: 1250, currency: null },
  },
};

function renderPage() {
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={client}>
        <MemoryRouter>{children}</MemoryRouter>
      </QueryClientProvider>
    );
  }

  return render(<DashboardPage />, { wrapper: Wrapper });
}

describe("DashboardPage", () => {
  beforeEach(() => {
    mockedGetDashboard.mockReset();
  });

  it("loads metrics, date filters, export, and core module navigation", async () => {
    mockedGetDashboard.mockResolvedValue(successResponse);
    renderPage();

    expect(screen.getByLabelText("Start date")).toBeInTheDocument();
    expect(screen.getByLabelText("End date")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Export analytics data" }),
    ).toBeDisabled();

    await waitFor(() => {
      expect(screen.getByText("Total Organizations")).toBeInTheDocument();
    });

    expect(
      screen.getByRole("navigation", { name: "Core modules" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Organizations/ })).toHaveAttribute(
      "href",
      "/admin/dashboard#total-organizations",
    );
    expect(
      screen.getByRole("button", { name: "Export analytics data" }),
    ).toBeEnabled();
  });

  it("shows an error when dashboard metrics cannot be loaded", async () => {
    mockedGetDashboard.mockRejectedValue(
      new ApiError("Dashboard unavailable", 500),
    );
    renderPage();

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Dashboard unavailable",
      );
    });
  });

  it("validates an incomplete date range before fetching", async () => {
    mockedGetDashboard.mockResolvedValue(successResponse);
    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByLabelText("Start date"), "2026-01-01");
    await user.click(screen.getByRole("button", { name: "Apply date range" }));

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Enter both a start date and an end date.",
    );
  });
});
