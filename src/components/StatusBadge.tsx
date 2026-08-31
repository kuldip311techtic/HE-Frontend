import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  active: boolean;
  label?: string;
}

export function StatusBadge({ active, label }: StatusBadgeProps) {
  return (
    <Badge variant={active ? "success" : "muted"}>
      {label ?? (active ? "Active" : "Inactive")}
    </Badge>
  );
}
