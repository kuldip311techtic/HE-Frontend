import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { DashboardMetrics } from "@/components/ui/DashboardMetrics";
import type { DashboardMetricCard } from "@/hooks/useDashboardMetrics";

const cards: DashboardMetricCard[] = [
  {
    id: "total-organizations",
    label: "Total Organizations",
    value: 12,
    kind: "count",
    currency: null,
  },
  {
    id: "total-coaches",
    label: "Total Coaches",
    value: 4,
    kind: "count",
    currency: null,
  },
  {
    id: "total-players",
    label: "Total Players",
    value: 80,
    kind: "count",
    currency: null,
  },
  {
    id: "total-sessions",
    label: "Total Sessions",
    value: 19,
    kind: "count",
    currency: null,
  },
  {
    id: "active-subscriptions",
    label: "Active Subscriptions",
    value: 7,
    kind: "count",
    currency: null,
  },
  {
    id: "revenue-overview",
    label: "Revenue Overview",
    value: 1250,
    kind: "revenue",
    currency: null,
  },
];

describe("DashboardMetrics", () => {
  it("shows a loading spinner while metrics are fetching", () => {
    render(
      <DashboardMetrics
        isLoading
        isError={false}
        isEmpty={false}
        isSuccess={false}
        errorMessage={null}
        cards={[]}
      />,
    );

    expect(screen.getByRole("status")).toHaveTextContent(
      "Loading dashboard metrics",
    );
  });

  it("shows an inline error when the dashboard request fails", () => {
    render(
      <DashboardMetrics
        isLoading={false}
        isError
        isEmpty={false}
        isSuccess={false}
        errorMessage="Dashboard unavailable"
        cards={[]}
      />,
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Dashboard unavailable",
    );
  });

  it("shows an empty state when no metric values are returned", () => {
    render(
      <DashboardMetrics
        isLoading={false}
        isError={false}
        isEmpty
        isSuccess
        errorMessage={null}
        cards={[]}
      />,
    );

    expect(screen.getByRole("status")).toHaveTextContent(
      "No dashboard metrics",
    );
  });

  it("renders all key metrics on success", () => {
    render(
      <DashboardMetrics
        isLoading={false}
        isError={false}
        isEmpty={false}
        isSuccess
        errorMessage={null}
        cards={cards}
      />,
    );

    expect(screen.getByText("Total Organizations")).toBeInTheDocument();
    expect(screen.getByText("Total Coaches")).toBeInTheDocument();
    expect(screen.getByText("Total Players")).toBeInTheDocument();
    expect(screen.getByText("Total Sessions")).toBeInTheDocument();
    expect(screen.getByText("Active Subscriptions")).toBeInTheDocument();
    expect(screen.getByText("Revenue Overview")).toBeInTheDocument();
  });
});
