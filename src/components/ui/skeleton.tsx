import * as React from 'react';
import { cn } from '@/lib/utils/cn';

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-figma-10 bg-muted', className)}
      aria-hidden
      {...props}
    />
  );
}

export { Skeleton };
