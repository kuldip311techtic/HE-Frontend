import * as React from 'react';
import { cn } from '@/lib/utils/cn';

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          'flex h-12 w-full rounded-[10px] border border-figma-border bg-[var(--token-color-117)] px-[14px] py-3 font-outfit text-base font-normal leading-6 text-foreground ring-offset-background transition duration-200 focus-visible:outline-none focus-visible:border-primary focus-visible:shadow-[0_0_0_3px_rgba(184,255,60,0.15)] focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...props}
      >
        {children}
      </select>
    );
  },
);
Select.displayName = 'Select';

export { Select };
