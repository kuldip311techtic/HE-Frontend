import { useMemo, useState } from 'react';
import { useDashboardData } from '../../hooks/useDashboardData';
import {
  formatDateRangeLabel,
  getDefaultDateRange,
  validateDateRange,
  type DateRange,
} from '../../lib/dashboard/dateRange';
import { downloadDashboardCsv } from '../../lib/dashboard/export';
import {
  formatMetricValue,
  hasAnyMetricValues,
  isRevenueMetric,
  orderDashboardMetrics,
} from '../../lib/dashboard/metrics';
import Button from './Button';
import EmptyState from './EmptyState';
import ErrorMessage from './ErrorMessage';
import Input from './Input';
import LoadingSpinner from './LoadingSpinner';

function MetricCard({
  label,
  value,
  metricKey,
}: {
  label: string;
  value: number | null;
  metricKey: string;
}) {
  const displayValue =
    value === null
      ? '—'
      : formatMetricValue({
          key: metricKey,
          label,
          value,
        });

  return (
    <article
      className="rounded-2xl border border-line bg-surface p-6 shadow-card"
      aria-label={`${label}: ${displayValue}`}
    >
      <p className="text-sm font-semibold leading-5 text-muted">{label}</p>
      <p
        className={`mt-3 font-bold leading-10 text-ink ${
          isRevenueMetric({ key: metricKey }) ? 'text-2xl sm:text-3xl' : 'text-3xl'
        }`}
      >
        {displayValue}
      </p>
    </article>
  );
}

function AnalyticsToolbar({
  dateRange,
  dateRangeError,
  reportingPeriodLabel,
  exportDisabled,
  onDateRangeChange,
  onApply,
  onExport,
}: {
  dateRange: DateRange;
  dateRangeError: string | null;
  reportingPeriodLabel: string;
  exportDisabled: boolean;
  onDateRangeChange: (field: keyof DateRange, value: string) => void;
  onApply: () => void;
  onExport: () => void;
}) {
  return (
    <section
      aria-label="Analytics controls"
      className="rounded-2xl border border-line bg-surface p-5 shadow-card sm:p-6"
    >
      <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div className="grid flex-1 gap-4 sm:grid-cols-2">
          <Input
            id="dashboard-start-date"
            label="Start date"
            type="date"
            name="startDate"
            value={dateRange.startDate}
            onChange={(event) =>
              onDateRangeChange('startDate', event.target.value)
            }
          />
          <Input
            id="dashboard-end-date"
            label="End date"
            type="date"
            name="endDate"
            value={dateRange.endDate}
            onChange={(event) =>
              onDateRangeChange('endDate', event.target.value)
            }
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="sm:w-[140px]">
            <Button type="button" variant="primary" onClick={onApply}>
              Apply filter
            </Button>
          </div>
          <div className="sm:w-[160px]">
            <Button
              type="button"
              variant="accent"
              disabled={exportDisabled}
              onClick={onExport}
            >
              Export data
            </Button>
          </div>
        </div>
      </div>

      {dateRangeError ? (
        <div className="mt-4">
          <ErrorMessage message={dateRangeError} />
        </div>
      ) : (
        <p className="mt-4 text-sm leading-6 text-muted">
          Reporting period:{' '}
          <span className="font-semibold text-ink">{reportingPeriodLabel}</span>
        </p>
      )}
    </section>
  );
}

export default function DashboardMetrics() {
  const { data, isLoading, isError, isEmpty, error, refetch } =
    useDashboardData();
  const defaultRange = useMemo(() => getDefaultDateRange(), []);
  const [draftDateRange, setDraftDateRange] = useState<DateRange>(defaultRange);
  const [appliedDateRange, setAppliedDateRange] =
    useState<DateRange>(defaultRange);
  const [dateRangeError, setDateRangeError] = useState<string | null>(null);

  const orderedMetrics = useMemo(
    () => (data ? orderDashboardMetrics(data) : []),
    [data],
  );

  const handleDateRangeChange = (field: keyof DateRange, value: string) => {
    setDraftDateRange((current) => ({
      ...current,
      [field]: value,
    }));
    setDateRangeError(null);
  };

  const handleApplyDateRange = () => {
    const validation = validateDateRange(draftDateRange);

    if (!validation.isValid) {
      setDateRangeError(validation.error);
      return;
    }

    setAppliedDateRange(draftDateRange);
    setDateRangeError(null);
  };

  const handleExport = () => {
    if (!data) {
      return;
    }

    downloadDashboardCsv(data, appliedDateRange);
  };

  if (isLoading) {
    return (
      <section
        aria-label="Dashboard metrics"
        aria-busy="true"
        className="rounded-2xl bg-surface p-8 shadow-card"
      >
        <div className="flex items-center justify-center gap-3 py-12">
          <LoadingSpinner label="Loading dashboard metrics" />
          <span className="text-sm leading-6 text-muted">
            Loading dashboard metrics…
          </span>
        </div>
      </section>
    );
  }

  if (isError && error) {
    return (
      <section aria-label="Dashboard metrics" className="space-y-4">
        <ErrorMessage message={error} />
        <div className="max-w-xs">
          <Button type="button" variant="accent" onClick={() => void refetch()}>
            Retry
          </Button>
        </div>
      </section>
    );
  }

  if (isEmpty || !data || !hasAnyMetricValues(orderedMetrics)) {
    return (
      <section aria-label="Dashboard metrics" className="space-y-4">
        <AnalyticsToolbar
          dateRange={draftDateRange}
          dateRangeError={dateRangeError}
          reportingPeriodLabel={formatDateRangeLabel(appliedDateRange)}
          exportDisabled
          onDateRangeChange={handleDateRangeChange}
          onApply={handleApplyDateRange}
          onExport={handleExport}
        />
        <EmptyState
          title="No metrics available"
          description="Dashboard analytics will appear here once data is available."
        />
      </section>
    );
  }

  return (
    <section aria-label="Dashboard metrics" className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent">
            Analytics
          </p>
          <h2 className="mt-1 text-2xl font-bold leading-8 text-ink">
            Platform overview
          </h2>
        </div>
        {data.updated_at ? (
          <p className="text-xs leading-4 text-muted">
            Updated {new Date(data.updated_at).toLocaleString()}
          </p>
        ) : null}
      </div>

      <AnalyticsToolbar
        dateRange={draftDateRange}
        dateRangeError={dateRangeError}
        reportingPeriodLabel={formatDateRangeLabel(appliedDateRange)}
        exportDisabled={false}
        onDateRangeChange={handleDateRangeChange}
        onApply={handleApplyDateRange}
        onExport={handleExport}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {orderedMetrics.map((metric) => (
          <MetricCard
            key={metric.key}
            metricKey={metric.key}
            label={metric.label}
            value={metric.value}
          />
        ))}
      </div>
    </section>
  );
}
