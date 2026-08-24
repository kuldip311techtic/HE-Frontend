import { Navigate } from "react-router-dom";

import { ErrorMessage } from "@/components/ErrorMessage";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboard } from "@/hooks/useDashboard";
import { getStoredToken } from "@/lib/utils";

export default function SuperAdminDashboard() {
  const { data, isLoading, isError, error, refetch } = useDashboard();

  if (!getStoredToken()) {
    return <Navigate to="/super-admin/login" replace />;
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl space-y-6">
        <PageHeader
          title="Super Admin Dashboard"
          description="Loading your administration overview."
        />
        <Card>
          <CardContent className="space-y-4 pt-6">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-96" />
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner label="Loading dashboard" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-7xl">
        <PageHeader
          title="Super Admin Dashboard"
          description="Unable to load dashboard data."
        />
        <Card>
          <CardContent className="space-y-4 pt-6">
            <ErrorMessage
              message={error?.message ?? "Failed to load dashboard."}
            />
            <Button onClick={() => refetch()} variant="outline">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="Super Admin Dashboard"
        description={
          data?.message ||
          "Welcome to the Hoops Engine administration portal."
        }
      />
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">
            You are signed in. Use the navigation to manage organizations,
            users, and platform settings.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
