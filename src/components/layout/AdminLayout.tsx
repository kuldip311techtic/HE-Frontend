import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { EmptyState } from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useDashboardData } from '@/hooks/useDashboardData';
import { isDashboardEmpty } from '@/types/dashboard';
import { cn } from '@/lib/utils';

export function AdminLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { data, isLoading, isError, error, refetch, isFetching } =
    useDashboardData();

  const renderContent = () => {
    if (isLoading) {
      return (
        <div
          className="flex flex-col items-center justify-center gap-4 py-24"
          role="status"
          aria-live="polite"
          aria-label="Loading dashboard"
        >
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            Loading dashboard data…
          </p>
          <div className="grid w-full max-w-4xl grid-cols-1 gap-4 px-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-28 w-full rounded-lg" />
            ))}
          </div>
        </div>
      );
    }

    if (isError) {
      return (
        <div className="flex flex-col items-center justify-center gap-4 py-24">
          <AlertCircle
            className="h-10 w-10 text-destructive"
            aria-hidden="true"
          />
          <div className="text-center">
            <h3 className="text-lg font-semibold">Failed to load dashboard</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {error instanceof Error
                ? error.message
                : 'Unable to fetch dashboard data.'}
            </p>
          </div>
          <Button
            onClick={() => void refetch()}
            disabled={isFetching}
            aria-label="Retry loading dashboard"
          >
            <RefreshCw
              className={cn('mr-2 h-4 w-4', isFetching && 'animate-spin')}
            />
            Retry
          </Button>
        </div>
      );
    }

    if (data && isDashboardEmpty(data)) {
      return (
        <EmptyState
          title="No dashboard data yet"
          description="Analytics will appear here once organizations, coaches, and players are active on the platform."
          action={
            <Button
              variant="outline"
              onClick={() => void refetch()}
              disabled={isFetching}
            >
              Refresh
            </Button>
          }
        />
      );
    }

    return <Outlet context={{ dashboard: data }} />;
  };

  return (
    <div className="flex min-h-screen bg-background">
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 transform transition-transform lg:relative lg:translate-x-0',
          mobileNavOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
      >
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed((prev) => !prev)}
        />
      </div>

      {mobileNavOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          aria-label="Close navigation menu"
          onClick={() => setMobileNavOpen(false)}
        />
      ) : null}

      <div className="flex min-h-screen flex-1 flex-col">
        <Header
          title="Super Admin"
          onMenuClick={() => setMobileNavOpen(true)}
        />
        <main className="flex-1 overflow-auto p-4 lg:p-6">{renderContent()}</main>
      </div>
    </div>
  );
}
