import { RefreshCw } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { DashboardMetrics } from "@/components/DashboardMetrics";
import { EmptyState } from "@/components/EmptyState";
import { ErrorMessage } from "@/components/ErrorMessage";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { NavigationLinks } from "@/components/NavigationLinks";
import { PageHeader } from "@/components/PageHeader";
import { SuperAdminLayout } from "@/components/SuperAdminLayout";
import { Button } from "@/components/ui/button";
import { useDashboard } from "@/hooks/useDashboard";
import { getAuthToken } from "@/services/api-client";

export default function SuperAdminDashboard() {
  const navigate = useNavigate();
  const { data, isLoading, error, refetch } = useDashboard({
    enabled: Boolean(getAuthToken()),
  });

  useEffect(() => {
    if (!getAuthToken()) {
      navigate("/super-admin/login", { replace: true });
    }
  }, [navigate]);

  const handleRefresh = () => {
    void refetch(true);
  };

  return (
    <SuperAdminLayout>
      <PageHeader
        title="Dashboard"
        description="Hoops Engine Super Admin overview"
        action={
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isLoading}
            aria-label="Refresh dashboard data"
          >
            <RefreshCw
              className={isLoading ? "animate-spin" : undefined}
              aria-hidden="true"
            />
            Refresh
          </Button>
        }
      />

      {error && (
        <div className="mb-6">
          <ErrorMessage message={error} />
          <Button
            variant="link"
            className="mt-2 h-auto p-0 text-primary"
            onClick={() => void refetch(false)}
          >
            Retry
          </Button>
        </div>
      )}

      {isLoading ? (
        <LoadingSkeleton count={6} />
      ) : data ? (
        <>
          <DashboardMetrics data={data} />
          <NavigationLinks />
        </>
      ) : !error ? (
        <EmptyState
          title="No dashboard data"
          description="Platform metrics are not available yet. Try refreshing the dashboard."
          action={
            <Button onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              Refresh
            </Button>
          }
        />
      ) : null}
    </SuperAdminLayout>
  );
}
