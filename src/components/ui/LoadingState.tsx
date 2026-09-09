import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface LoadingStateProps {
  label?: string;
  className?: string;
}

export function LoadingState({ label = 'Loading…', className }: LoadingStateProps) {
  return (
    <div
      className={cn('flex flex-col items-center justify-center gap-3 py-12', className)}
      role="status"
      aria-live="polite"
    >
      <Loader2 className="h-8 w-8 animate-spin text-figma-brand" aria-hidden />
      <p className="text-body-sm text-muted-foreground">{label}</p>
    </div>
  );
}
