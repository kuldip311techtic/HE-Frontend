import { RefreshCw } from "lucide-react";

import { NavigationLink } from "@/components/NavigationLink";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuickAccessLinks } from "@/hooks/useQuickAccessLinks";
import type { QuickAccessLink } from "@/types/quick-access";

const SKELETON_COUNT = 5;

function NavigationLinkSkeleton() {
  return (
    <Card className="border-border/60 bg-card/80">
      <CardHeader className="flex flex-row items-start gap-3 space-y-0 pb-2">
        <Skeleton className="h-10 w-10 shrink-0 rounded-lg" />
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <Skeleton className="h-4 w-full" />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <Skeleton className="h-4 w-24" />
      </CardContent>
    </Card>
  );
}

export function QuickAccessNavigation() {
  const { data: links, isLoading, isError, error, refetch, isFetching } =
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
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Quick Access
          </h2>
          <p className="text-sm text-muted-foreground">
            Jump to core Super Admin modules.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: SKELETON_COUNT }, (_, index) => (
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
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Quick Access
          </h2>
          <p className="text-sm text-muted-foreground">
            Jump to core Super Admin modules.
          </p>
        </div>
        <Card className="border-destructive/30 bg-destructive/5">
          <CardHeader>
            <CardTitle className="text-base text-destructive">
              Unable to load quick access links
            </CardTitle>
            <CardDescription className="text-destructive/90">
              {error?.message ?? "An unexpected error occurred."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              onClick={() => refetch()}
              disabled={isRetrying}
              className="min-h-11"
              aria-label="Retry loading quick access links"
            >
              <RefreshCw
                className={`h-4 w-4 ${isRetrying ? "animate-spin" : ""}`}
                aria-hidden="true"
              />
              Retry
            </Button>
          </CardContent>
        </Card>
      </section>
    );
  }

  if (!links || links.length === 0) {
    return (
      <section aria-label="Quick access navigation empty" className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Quick Access
          </h2>
          <p className="text-sm text-muted-foreground">
            Jump to core Super Admin modules.
          </p>
        </div>
        <Card className="border-dashed border-border/60 bg-muted/10">
          <CardContent className="flex flex-col items-center justify-center px-6 py-12 text-center">
            <p className="text-sm text-muted-foreground">
              No quick access links are available at this time.
            </p>
            <Button
              variant="outline"
              onClick={() => refetch()}
              disabled={isRetrying}
              className="mt-4 min-h-11"
              aria-label="Refresh quick access links"
            >
              <RefreshCw
                className={`h-4 w-4 ${isRetrying ? "animate-spin" : ""}`}
                aria-hidden="true"
              />
              Refresh
            </Button>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section
      aria-label="Quick access navigation"
      className="space-y-4"
    >
      <div className="space-y-1">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          Quick Access
        </h2>
        <p className="text-sm text-muted-foreground">
          Jump to core Super Admin modules.
        </p>
      </div>
      <nav
        aria-label="Core module quick links"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
      >
        {links.map((link: QuickAccessLink) => (
          <NavigationLink key={link.id} link={link} />
        ))}
      </nav>
    </section>
  );
}
