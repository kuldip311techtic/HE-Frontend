import { Download, RefreshCw } from "lucide-react";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";

import { DashboardMetrics } from "@/components/dashboard/DashboardMetrics";
import { NavigationLinks } from "@/components/dashboard/NavigationLinks";
import { EmptyState } from "@/components/EmptyState";
import { Notification } from "@/components/Notification";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDashboard } from "@/hooks/useDashboard";
import {
  exportDashboardMetricsToCsv,
  isDashboardEmpty,
} from "@/lib/dashboard-helpers";
import { getStoredToken } from "@/lib/utils";

export default function SuperAdminDashboard() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [appliedRange, setAppliedRange] = useState<{
    start_date?: string;
    end_date?: string;
  }>({});

  const { data, isLoading, isError, error, refetch, isFetching } = useDashboard(
    appliedRange.start_date || appliedRange.end_date ? appliedRange : undefined,
  );

  if (!getStoredToken()) {
    return <Navigate to="/super-admin/login" replace />;
  }

  const metrics = data?.metrics;
  const isRefreshing = isFetching && !isLoading;

  const handleApplyDateRange = () => {
    if (startDate && endDate && startDate > endDate) {
      toast.error("Start date must be before or equal to end date.");
      return;
    }

    setAppliedRange({
      start_date: startDate || undefined,
      end_date: endDate || undefined,
    });
  };

  const handleClearDateRange = () => {
    setStartDate("");
    setEndDate("");
    setAppliedRange({});
  };

  const handleRefresh = async () => {
    const result = await refetch();

    if (result.isError) {
      toast.error(
        result.error instanceof Error
          ? result.error.message
          : "Failed to refresh dashboard data.",
      );
      return;
    }

    toast.success("Dashboard data refreshed successfully.");
  };

  const handleExport = () => {
    if (!metrics) {
      toast.error("No dashboard data available to export.");
      return;
    }

    exportDashboardMetricsToCsv(metrics, {
      startDate: appliedRange.start_date,
      endDate: appliedRange.end_date,
    });
    toast.success("Analytics data exported successfully.");
  };

  return (
    <div className="w-full space-y-8">
      <PageHeader
        title="Super Admin Dashboard"
        description={
          data?.description ??
          "Overview of platform performance and quick access to core modules."
        }
        action={
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isLoading || isRefreshing}
              className="min-h-11 w-full sm:w-auto"
              aria-label="Refresh dashboard data"
            >
              <RefreshCw
                className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
                aria-hidden="true"
              />
              Refresh
            </Button>
            <Button
              variant="outline"
              onClick={handleExport}
              disabled={isLoading || !metrics}
              className="min-h-11 w-full sm:w-auto"
              aria-label="Export analytics data"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Export
            </Button>
          </div>
        }
      />

      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-1">
            <h2 className="text-base font-semibold">Analytics Date Range</h2>
            <p className="text-sm text-muted-foreground">
              Filter dashboard metrics by selecting a start and end date.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="dashboard-start-date">Start date</Label>
              <Input
                id="dashboard-start-date"
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
                aria-label="Analytics start date"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dashboard-end-date">End date</Label>
              <Input
                id="dashboard-end-date"
                type="date"
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
                aria-label="Analytics end date"
              />
            </div>
            <div className="flex items-end gap-2 sm:col-span-2">
              <Button
                onClick={handleApplyDateRange}
                disabled={isLoading}
                className="min-h-11 flex-1 sm:flex-none"
                aria-label="Apply date range filter"
              >
                Apply filter
              </Button>
              <Button
                variant="outline"
                onClick={handleClearDateRange}
                disabled={isLoading || (!startDate && !endDate && !appliedRange.start_date && !appliedRange.end_date)}
                className="min-h-11 flex-1 sm:flex-none"
                aria-label="Clear date range filter"
              >
                Clear
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {isError ? (
        <Card>
          <CardContent className="space-y-4 pt-6">
            <Notification
              message={error?.message ?? "Failed to load dashboard data."}
              variant="error"
            />
            <Button variant="outline" onClick={() => refetch()} className="min-h-11">
              Retry
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <DashboardMetrics metrics={metrics} isLoading={isLoading} />

          {!isLoading && metrics && isDashboardEmpty(metrics) && (
            <EmptyState
              title="No analytics data yet"
              description="Platform metrics will appear here once organizations, users, and sessions are recorded."
              action={
                <Button
                  variant="outline"
                  onClick={handleRefresh}
                  className="min-h-11"
                  aria-label="Refresh dashboard metrics"
                >
                  <RefreshCw className="h-4 w-4" aria-hidden="true" />
                  Refresh metrics
                </Button>
              }
            />
          )}

          <NavigationLinks links={metrics?.links} isLoading={isLoading} />
        </>
      )}
    </div>
  );
}
