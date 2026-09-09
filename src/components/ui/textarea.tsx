import * as React from 'react';
import { cn } from '@/lib/utils/cn';

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[100px] w-full rounded-figma-10 border border-[#0d1612] bg-[#0b1f12] px-[14px] py-2 font-outfit text-base text-foreground ring-offset-background placeholder:text-[#445154] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#86d31f] focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = 'Textarea';

export { Textarea };
