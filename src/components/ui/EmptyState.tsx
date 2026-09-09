import { Inbox } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3 py-12 text-center', className)}>
      <Inbox className="h-10 w-10 text-muted-foreground" aria-hidden />
      <div className="space-y-1">
        <h3 className="text-body-25 text-foreground">{title}</h3>
        {description ? <p className="text-body-sm text-muted-foreground">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
