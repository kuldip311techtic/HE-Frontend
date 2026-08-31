import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { EmptyState } from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useDashboardData } from '@/hooks/useDashboardData';
import { formatNumber } from '@/lib/utils';
import { isDashboardEmpty } from '@/types/dashboard';
import { cn } from '@/lib/utils';

function DashboardPanel() {
  const { data, isLoading, isError, error, refetch, isFetching } =
    useDashboardData();

  if (isLoading) {
    return (
      <div className="space-y-6" aria-busy="true" aria-label="Loading dashboard">
        <div className="flex items-center gap-3">
          <Loader2
            className="h-5 w-5 animate-spin text-primary"
            aria-hidden="true"
          />
          <p className="text-sm text-muted-foreground">Loading dashboard data…</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-28 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <EmptyState
        title="Unable to load dashboard"
        description={
          error instanceof Error
            ? error.message
            : 'An error occurred while fetching dashboard data.'
        }
        actionLabel="Retry"
        onAction={() => {
          void refetch();
        }}
      />
    );
  }

  if (isDashboardEmpty(data)) {
    return (
      <EmptyState
        title="No dashboard data yet"
        description="The dashboard endpoint returned successfully but no analytics are available yet."
        actionLabel={isFetching ? 'Refreshing…' : 'Refresh'}
        onAction={() => {
          void refetch();
        }}
      />
    );
  }

  return (
    <div className={cn('space-y-6', isFetching && 'opacity-70')}>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Organizations', value: data?.total_organizations },
          { label: 'Users', value: data?.total_users },
          { label: 'Active Sessions', value: data?.active_sessions },
          { label: 'Pending Verifications', value: data?.pending_verifications },
        ]
          .filter((metric) => metric.value != null)
          .map((metric) => (
            <Card key={metric.label}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {formatNumber(Number(metric.value))}
                </p>
              </CardContent>
            </Card>
          ))}
      </div>

      {data?.metrics && data.metrics.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {data.metrics.map((metric) => (
            <Card key={metric.label}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold">{metric.value}</p>
                {metric.change ? (
                  <p className="text-xs text-muted-foreground">{metric.change}</p>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}

      {data?.recent_activity && data.recent_activity.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.recent_activity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start justify-between gap-4 border-b pb-4 last:border-0 last:pb-0"
              >
                <div>
                  <p className="font-medium">{activity.title}</p>
                  {activity.description ? (
                    <p className="text-sm text-muted-foreground">
                      {activity.description}
                    </p>
                  ) : null}
                </div>
                {activity.timestamp ? (
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {activity.timestamp}
                  </span>
                ) : null}
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}

      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          void refetch();
        }}
        disabled={isFetching}
        aria-label="Refresh dashboard data"
      >
        {isFetching ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Refreshing
          </>
        ) : (
          'Refresh dashboard'
        )}
      </Button>
    </div>
  );
}

export function AdminLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const location = useLocation();
  const isDashboardRoute =
    location.pathname === '/admin' || location.pathname === '/admin/';

  return (
    <div className="flex min-h-screen bg-muted/30">
      <div className="hidden lg:block">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
        />
      </div>

      {mobileNavOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            aria-label="Close navigation overlay"
            onClick={() => setMobileNavOpen(false)}
          />
          <div className="relative z-50 h-full w-64">
            <Sidebar
              collapsed={false}
              onToggleCollapse={() => setMobileNavOpen(false)}
            />
          </div>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <Header showMenuButton onMenuClick={() => setMobileNavOpen(true)} />

        <main className="flex-1 overflow-auto p-4 lg:p-6">
          {isDashboardRoute ? <DashboardPanel /> : null}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
