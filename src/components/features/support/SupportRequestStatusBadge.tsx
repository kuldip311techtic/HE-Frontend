import { cn } from '@/lib/utils/cn';

interface SupportRequestStatusBadgeProps {
  status: string;
}

export function SupportRequestStatusBadge({ status }: SupportRequestStatusBadgeProps) {
  const normalized = status.toLowerCase();
  const isClosed = normalized === 'closed';

  return (
    <span
      className={cn(
        'inline-flex rounded-full px-2.5 py-0.5 font-outfit text-body-sm capitalize',
        isClosed ? 'bg-muted text-muted-foreground' : 'bg-sidebar-accent/15 text-sidebar-accent',
      )}
    >
      {status}
    </span>
  );
}
