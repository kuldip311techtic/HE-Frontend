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

import { StatusBadge } from "@/components/StatusBadge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { QuickAccessLink } from "@/types/quick-access";

const MODULE_ICONS: Record<string, LucideIcon> = {
  organizations: Building2,
  users: Users,
  subscriptions: CreditCard,
  analytics: BarChart3,
  support: HeadphonesIcon,
};

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

interface NavigationLinkProps {
  link: QuickAccessLink;
}

export function NavigationLink({ link }: NavigationLinkProps) {
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
