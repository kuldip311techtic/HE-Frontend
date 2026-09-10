import * as React from 'react';
import { cn } from '@/lib/utils/cn';

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          'flex min-h-[110px] w-full rounded-[10px] border border-figma-border bg-[var(--token-color-117)] px-[14px] py-3 font-outfit text-base font-normal leading-6 text-foreground ring-offset-background placeholder:text-muted-foreground transition duration-200 focus-visible:outline-none focus-visible:border-primary focus-visible:shadow-[0_0_0_3px_rgba(184,255,60,0.15)] focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...props}
      />
    );
  },
);
Textarea.displayName = 'Textarea';

export { Textarea };
