import type { LucideIcon } from 'lucide-react';
import { Inbox } from 'lucide-react';

import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-muted/30 px-6 py-12 text-center',
        className,
      )}
    >
      <Icon className="h-10 w-10 text-muted-foreground" aria-hidden="true" />
      <div className="space-y-1">
        <h3 className="font-outfit text-body-10">{title}</h3>
        {description ? <p className="text-body-sm text-muted-foreground">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
