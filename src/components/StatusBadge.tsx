import { Badge } from "@/components/ui/badge";
import { cn, isActiveStatus } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const active = isActiveStatus(status);

  return (
    <Badge
      variant={active ? "default" : "secondary"}
      className={cn(
        active
          ? "border-transparent bg-success/20 text-success hover:bg-success/30"
          : "border-transparent bg-muted text-muted-foreground",
        className
      )}
      aria-label={`Status: ${status}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}
