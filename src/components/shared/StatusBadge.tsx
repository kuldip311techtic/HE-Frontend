import { Badge } from '@/components/ui/badge';
import { isActiveSubscriptionStatus } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
}

function getStatusVariant(
  status: string,
): 'success' | 'warning' | 'secondary' | 'destructive' {
  const normalized = status.toLowerCase();

  if (normalized === 'active' || normalized === 'responded' || normalized === 'resolved') {
    return 'success';
  }

  if (
    normalized === 'draft' ||
    normalized === 'pending' ||
    normalized === 'open'
  ) {
    return 'warning';
  }

  if (
    normalized === 'inactive' ||
    normalized === 'archived' ||
    normalized === 'closed'
  ) {
    return 'secondary';
  }

  return 'secondary';
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const variant = getStatusVariant(status);
  const label = status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <Badge
      variant={variant}
      aria-label={`Status: ${label}${isActiveSubscriptionStatus(status) ? ', active plan' : ''}`}
    >
      {label}
    </Badge>
  );
}
