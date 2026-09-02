import {
  ArrowRight,
  BarChart3,
  Building2,
  CreditCard,
  HeadphonesIcon,
  LayoutGrid,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

import { EmptyState } from "@/components/EmptyState";
import { ErrorMessage } from "@/components/ErrorMessage";
import { StatusBadge } from "@/components/StatusBadge";
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
import { ApiClientError } from "@/services/api-client";
import type { QuickAccessLink } from "@/types/quick-access";

const MODULE_ICONS: Record<string, LucideIcon> = {
  organizations: Building2,
  users: Users,
  subscriptions: CreditCard,
  analytics: BarChart3,
  support: HeadphonesIcon,
};

const QUICK_ACCESS_SKELETON_COUNT = 5;

function resolveModuleIcon(label: string): LucideIcon {
  const normalized = label.toLowerCase();

  if (normalized.includes("organization")) {
    return MODULE_ICONS.organizations;
  }

  if (normalized.includes("user")) {
    return MODULE_ICONS.users;
  }

  if (normalized.includes("subscription")) {
    return MODULE_ICONS.subscriptions;
  }

  if (normalized.includes("analytics")) {
    return MODULE_ICONS.analytics;
  }

  if (normalized.includes("support")) {
    return MODULE_ICONS.support;
  }

  return LayoutGrid;
}

function QuickAccessLinkSkeleton() {
  return (
    <Card>
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="h-4 w-full" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-24" />
      </CardContent>
    </Card>
  );
}

function QuickAccessLinkCard({ link }: { link: QuickAccessLink }) {
  const Icon = resolveModuleIcon(link.label);

  return (
    <Link
      to={link.path}
      className="group block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      aria-label={`Navigate to ${link.label}`}
    >
      <Card className="h-full transition-colors duration-200 hover:border-primary/40 hover:bg-accent/30 hover:shadow-md active:scale-press group-active:border-[var(--interactive-active-border)] group-active:bg-[var(--interactive-active-background)]">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 gap-3">
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="text-base">{link.label}</CardTitle>
              <StatusBadge status={link.status} />
            </div>
            {link.description ? (
              <CardDescription className="line-clamp-2">
                {link.description}
              </CardDescription>
            ) : null}
          </div>
          <Icon
            className="h-5 w-5 shrink-0 text-muted-foreground transition-colors group-hover:text-primary"
            aria-hidden="true"
          />
        </CardHeader>
        <CardContent>
          <span className="inline-flex min-h-11 items-center gap-1 text-sm font-medium text-primary">
            Open module
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </span>
        </CardContent>
      </Card>
    </Link>
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
            <QuickAccessLinkSkeleton key={`quick-access-skeleton-${index}`} />
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
          <QuickAccessLinkCard key={link.id} link={link} />
        ))}
      </nav>
    </section>
  );
}
