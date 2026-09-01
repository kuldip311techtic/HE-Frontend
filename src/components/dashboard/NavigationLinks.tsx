import {
  ArrowRight,
  Building2,
  CreditCard,
  GraduationCap,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DEFAULT_MODULE_LINKS } from "@/lib/dashboard-helpers";
import type { DashboardLink } from "@/types/dashboard";

const MODULE_ICONS: Record<string, LucideIcon> = {
  Organizations: Building2,
  Coaches: GraduationCap,
  Players: Users,
  Subscriptions: CreditCard,
};

interface NavigationLinksProps {
  links?: DashboardLink[];
  isLoading?: boolean;
}

function resolveLinkLabel(link: DashboardLink, index: number): string {
  const fallback = DEFAULT_MODULE_LINKS[index]?.label;
  if (fallback) {
    return fallback;
  }

  const segment = link.link.split("/").filter(Boolean).pop();
  if (segment) {
    return segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  return link.description;
}

function resolveNavigationHref(link: DashboardLink, index: number): string {
  if (link.link.startsWith("/")) {
    return link.link;
  }

  return DEFAULT_MODULE_LINKS[index]?.link ?? "/super-admin/dashboard";
}

function getNavigationItems(links?: DashboardLink[]) {
  if (links && links.length > 0) {
    return links.map((link, index) => ({
      href: resolveNavigationHref(link, index),
      label: resolveLinkLabel(link, index),
      description: link.description,
    }));
  }

  return DEFAULT_MODULE_LINKS.map(({ link, description, label }) => ({
    href: link,
    label,
    description,
  }));
}

function NavigationLinkSkeleton() {
  return (
    <Card>
      <CardHeader className="space-y-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-full" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-24" />
      </CardContent>
    </Card>
  );
}

export function NavigationLinks({ links, isLoading }: NavigationLinksProps) {
  if (isLoading) {
    return (
      <section aria-label="Module navigation loading" className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight">Core Modules</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {DEFAULT_MODULE_LINKS.map(({ label }) => (
            <NavigationLinkSkeleton key={label} />
          ))}
        </div>
      </section>
    );
  }

  const navigationItems = getNavigationItems(links);

  return (
    <section aria-label="Core module navigation" className="space-y-4">
      <h2 className="text-lg font-semibold tracking-tight">Core Modules</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {navigationItems.map(({ href, label, description }) => {
          const Icon = MODULE_ICONS[label] ?? ArrowRight;

          return (
            <Link
              key={`${href}-${label}`}
              to={href}
              className="group block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-label={`Navigate to ${label}`}
            >
              <Card className="h-full transition-colors hover:border-primary/40 hover:bg-accent/30 hover:shadow-md">
                <CardHeader className="flex flex-row items-start justify-between space-y-0">
                  <div className="space-y-1">
                    <CardTitle className="text-base">{label}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                  </div>
                  <Icon
                    className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary"
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
        })}
      </div>
    </section>
  );
}
