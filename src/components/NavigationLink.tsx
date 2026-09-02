import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  formatQuickAccessStatus,
  getQuickAccessIcon,
} from "@/lib/quick-access-helpers";
import { cn } from "@/lib/utils";
import type { QuickAccessLink } from "@/types/quick-access";

interface NavigationLinkProps {
  link: QuickAccessLink;
  className?: string;
}

function getStatusBadgeVariant(
  status: string,
): "default" | "secondary" | "success" | "warning" | "destructive" | "outline" {
  const normalized = status.toLowerCase();

  if (normalized === "active") return "success";
  if (normalized === "new") return "default";
  if (normalized === "pending" || normalized === "warning") return "warning";
  if (normalized === "inactive") return "secondary";
  if (normalized === "error") return "destructive";

  return "outline";
}

export function LinkStatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  return (
    <Badge
      variant={getStatusBadgeVariant(status)}
      className={cn("shrink-0", className)}
      aria-label={`Status: ${formatQuickAccessStatus(status)}`}
    >
      {formatQuickAccessStatus(status)}
    </Badge>
  );
}

export function NavigationLink({ link, className }: NavigationLinkProps) {
  const Icon = getQuickAccessIcon(link);
  const status = link.status ?? "active";

  return (
    <Link
      to={link.href}
      className={cn(
        "group block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
      aria-label={`Navigate to ${link.label}`}
    >
      <Card className="h-full border-border/60 bg-card/80 transition-colors hover:border-primary/40 hover:bg-accent/20 hover:shadow-md">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"
              aria-hidden="true"
            >
              <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <CardTitle className="text-base font-semibold text-foreground">
                  {link.label}
                </CardTitle>
                <LinkStatusBadge status={status} />
              </div>
              {link.description ? (
                <CardDescription className="line-clamp-2 text-sm text-muted-foreground">
                  {link.description}
                </CardDescription>
              ) : null}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
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
