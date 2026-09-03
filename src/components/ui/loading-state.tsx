import { Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({ message = 'Loading…', className }: LoadingStateProps) {
  return (
    <div
      className={cn('flex min-h-[50vh] flex-col items-center justify-center gap-3', className)}
      role="status"
      aria-live="polite"
    >
      <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
      <p className="text-body-sm text-muted-foreground">{message}</p>
    </div>
  );
}
