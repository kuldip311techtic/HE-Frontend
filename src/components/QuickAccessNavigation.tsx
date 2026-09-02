import { EmptyState } from "@/components/EmptyState";
import { ErrorMessage } from "@/components/ErrorMessage";
import { NavigationLink } from "@/components/NavigationLink";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuickAccessLinks } from "@/hooks/useQuickAccessLinks";
import { ApiClientError } from "@/services/api-client";

const QUICK_ACCESS_SKELETON_COUNT = 5;

function NavigationLinkSkeleton() {
  return (
    <Card>
      <CardContent className="space-y-3 pt-6">
        <div className="flex items-start justify-between gap-3">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-24" />
      </CardContent>
    </Card>
  );
}

function getErrorMessage(error: unknown): string {
  if (error instanceof ApiClientError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Failed to load quick access links.";
}

export function QuickAccessNavigation() {
  const { data, isLoading, isError, error, refetch, isFetching } =
    useQuickAccessLinks();

  const isRetrying = isFetching && !isLoading;

  if (isLoading) {
    return (
      <section
        aria-label="Quick access navigation loading"
        aria-busy="true"
        className="space-y-4"
      >
        <div className="space-y-1">
          <h2 className="text-lg font-semibold tracking-tight">Quick Access</h2>
          <p className="text-sm text-muted-foreground">
            Jump to core Super Admin modules.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: QUICK_ACCESS_SKELETON_COUNT }).map((_, index) => (
            <NavigationLinkSkeleton key={`quick-access-skeleton-${index}`} />
          ))}
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section aria-label="Quick access navigation error" className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold tracking-tight">Quick Access</h2>
          <p className="text-sm text-muted-foreground">
            Jump to core Super Admin modules.
          </p>
        </div>
        <Card>
          <CardContent className="space-y-4 pt-6">
            <ErrorMessage message={getErrorMessage(error)} />
            <Button
              variant="outline"
              onClick={() => refetch()}
              disabled={isRetrying}
              className="min-h-11"
              aria-label="Retry loading quick access links"
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </section>
    );
  }

  if (!data || data.length === 0) {
    return (
      <section aria-label="Quick access navigation empty" className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold tracking-tight">Quick Access</h2>
          <p className="text-sm text-muted-foreground">
            Jump to core Super Admin modules.
          </p>
        </div>
        <EmptyState
          title="No quick access links available"
          description="Quick access links will appear here once they are configured for your account."
        />
      </section>
    );
  }

  return (
    <section aria-label="Quick access navigation" className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold tracking-tight">Quick Access</h2>
        <p className="text-sm text-muted-foreground">
          Jump to core Super Admin modules.
        </p>
      </div>
      <nav
        aria-label="Quick access module links"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {data.map((link) => (
          <NavigationLink key={link.id} link={link} />
        ))}
      </nav>
    </section>
  );
}
