import { EmptyState } from "@/components/ui/EmptyState";
import { Spinner } from "@/components/ui/Spinner";
import { formatCount, formatRevenue } from "@/lib/format";
import type { DashboardMetricCard } from "@/hooks/useDashboardMetrics";

interface DashboardMetricsProps {
  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;
  isSuccess: boolean;
  errorMessage: string | null;
  cards: DashboardMetricCard[];
}

function formatCardValue(card: DashboardMetricCard): string {
  if (card.value === null) {
    return "Not available";
  }
  if (card.kind === "revenue") {
    return formatRevenue(card.value, card.currency);
  }
  return formatCount(card.value);
}

export function DashboardMetrics({
  isLoading,
  isError,
  isEmpty,
  isSuccess,
  errorMessage,
  cards,
}: DashboardMetricsProps) {
  if (isLoading) {
    return (
      <div className="rounded-lg border border-border bg-surface p-10 shadow-sm">
        <Spinner label="Loading dashboard metrics" />
      </div>
    );
  }

  if (isError) {
    return (
      <div
        role="alert"
        className="rounded-lg border border-error-border bg-error-background p-6"
      >
        <h2 className="text-lg font-semibold text-error">
          Unable to load dashboard
        </h2>
        <p className="mt-2 text-sm text-foreground">
          {errorMessage ?? "Unable to load dashboard data."}
        </p>
      </div>
    );
  }

  if (isEmpty || !isSuccess) {
    return (
      <EmptyState
        title="No dashboard metrics"
        description="The dashboard did not return any metric values for the selected range."
      />
    );
  }

  return (
    <section
      aria-label="Dashboard metrics"
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
    >
      {cards.map((card) => (
        <article
          key={card.id}
          id={card.id}
          tabIndex={-1}
          className="rounded-lg border border-border bg-surface p-5 shadow-sm transition-colors hover:border-primary hover:shadow-md focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-focus scroll-mt-header"
        >
          <h3 className="text-sm font-medium text-muted">{card.label}</h3>
          <p className="mt-2 text-2xl font-semibold text-foreground">
            {formatCardValue(card)}
          </p>
        </article>
      ))}
    </section>
  );
}
