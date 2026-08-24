import { Badge } from "@/components/ui/badge";
import { normalizeRole } from "@/lib/user-helpers";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  role: string;
  className?: string;
}

export function StatusBadge({ role, className }: StatusBadgeProps) {
  const normalizedRole = normalizeRole(role);

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
