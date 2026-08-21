import { useState, type FormEvent } from "react";

import { DashboardMetrics } from "@/components/ui/DashboardMetrics";
import { NavigationLinks } from "@/components/ui/NavigationLinks";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  useDashboardMetrics,
  type DashboardMetricCard,
} from "@/hooks/useDashboardMetrics";
import { escapeCsvValue, formatCount, formatRevenue } from "@/lib/format";
import type { DashboardDateRange } from "@/types/api";

function exportAnalyticsCsv(cards: DashboardMetricCard[]): void {
  const lines = ["Metric,Value"];

  for (const card of cards) {
    if (card.value === null) {
      continue;
    }

    const display =
      card.kind === "revenue"
        ? formatRevenue(card.value, card.currency)
        : formatCount(card.value);
    lines.push(`${escapeCsvValue(card.label)},${escapeCsvValue(display)}`);
  }

  const blob = new Blob([lines.join("\n")], {
    type: "text/csv;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "analytics-dashboard.csv";
  link.click();
  URL.revokeObjectURL(url);
}

export function DashboardPage() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [rangeError, setRangeError] = useState<string | null>(null);
  const [appliedRange, setAppliedRange] = useState<DashboardDateRange | null>(
    null,
  );

  const metrics = useDashboardMetrics(appliedRange);

  function handleApplyRange(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if ((from && !to) || (!from && to)) {
      setRangeError("Enter both a start date and an end date.");
      return;
    }

    if (from && to && from > to) {
      setRangeError("The start date must be on or before the end date.");
      return;
    }

    setRangeError(null);
    setAppliedRange(from && to ? { from, to } : null);
  }

  function handleClearRange() {
    setFrom("");
    setTo("");
    setRangeError(null);
    setAppliedRange(null);
  }

  const canExport = metrics.isSuccess && !metrics.isEmpty;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">
          Analytics dashboard
        </h2>
        <p className="mt-1 text-sm text-muted">
          Monitor platform performance and move into a core module.
        </p>
      </div>

      <form
        onSubmit={handleApplyRange}
        aria-label="Filter analytics by date range"
        className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-4 shadow-sm"
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
          <div className="grid flex-1 gap-4 sm:grid-cols-2">
            <Input
              id="analytics-from"
              name="from"
              type="date"
              label="Start date"
              value={from}
              onChange={(event) => setFrom(event.target.value)}
              max={to || undefined}
            />
            <Input
              id="analytics-to"
              name="to"
              type="date"
              label="End date"
              value={to}
              onChange={(event) => setTo(event.target.value)}
              min={from || undefined}
            />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button type="submit">Apply date range</Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handleClearRange}
            >
              Clear dates
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => exportAnalyticsCsv(metrics.cards)}
              disabled={!canExport}
              aria-label="Export analytics data"
            >
              Export analytics
            </Button>
          </div>
        </div>
        {rangeError ? (
          <p role="alert" className="text-sm text-error">
            {rangeError}
          </p>
        ) : null}
      </form>

      <DashboardMetrics
        isLoading={metrics.isLoading}
        isError={metrics.isError}
        isEmpty={metrics.isEmpty}
        isSuccess={metrics.isSuccess}
        errorMessage={metrics.errorMessage}
        cards={metrics.cards}
      />

      <NavigationLinks />
    </div>
  );
}
