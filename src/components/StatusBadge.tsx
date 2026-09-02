import { Badge } from "@/components/ui/badge";
import {
  formatQuickAccessStatus,
  getQuickAccessStatusVariant,
} from "@/lib/quick-access-helpers";
import { normalizeRole } from "@/lib/user-helpers";
import { cn } from "@/lib/utils";
import type { QuickAccessLinkStatus } from "@/types/quick-access";

type RoleStatusBadgeProps = {
  role: string;
  status?: never;
  className?: string;
};

type NavigationStatusBadgeProps = {
  status: QuickAccessLinkStatus;
  role?: never;
  className?: string;
};

type StatusBadgeProps = RoleStatusBadgeProps | NavigationStatusBadgeProps;

export function StatusBadge(props: StatusBadgeProps) {
  const { className } = props;

  if ("status" in props && props.status !== undefined) {
    const variant = getQuickAccessStatusVariant(props.status);

    return (
      <Badge variant={variant} className={cn(className)}>
        {formatQuickAccessStatus(props.status)}
      </Badge>
    );
  }

  const normalizedRole = normalizeRole(props.role);

  const variant =
    normalizedRole === "Coach"
      ? "default"
      : normalizedRole === "Player"
        ? "secondary"
        : "outline";

  return (
    <Badge variant={variant} className={cn(className)}>
      {normalizedRole}
    </Badge>
  );
}
