import { forwardRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  id: string;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, error, id, className, ...props }, ref) => {
    const errorId = error ? `${id}-error` : undefined;

    return (
      <div className="space-y-2">
        <Label htmlFor={id}>{label}</Label>
        <Input
          ref={ref}
          id={id}
          aria-label={label}
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId}
          className={cn(error && 'border-destructive focus-visible:ring-destructive', className)}
          {...props}
        />
        {error ? (
          <p id={errorId} className="text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);

TextInput.displayName = 'TextInput';
