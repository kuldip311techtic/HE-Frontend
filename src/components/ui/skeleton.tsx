import { cn } from '@/lib/utils/cn';

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-muted/60', className)}
      role="status"
      aria-live="polite"
      {...props}
    />
  );
}

export { Skeleton };
