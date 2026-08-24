import { Navigate } from "react-router-dom";

import { ErrorMessage } from "@/components/ErrorMessage";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
        <Skeleton className="h-8 w-64" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-96" />
          </CardHeader>
          <CardContent className="flex items-center justify-center py-12">
            <LoadingSpinner label="Loading dashboard" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-7xl">
        <Card>
          <CardHeader>
            <CardTitle>Super Admin Dashboard</CardTitle>
            <CardDescription>
              Unable to load dashboard data.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
      <Card>
        <CardHeader>
          <CardTitle>Super Admin Dashboard</CardTitle>
          <CardDescription>
            {data?.message ||
              "Welcome to the Hoops Engine administration portal."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            You are signed in. Use the navigation to manage organizations,
            users, and platform settings.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
