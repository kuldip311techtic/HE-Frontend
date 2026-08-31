import * as React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

export interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, error, id, className, ...props }, ref) => {
    const inputId = id ?? props.name

    return (
      <div className="space-y-2">
        <Label htmlFor={inputId}>{label}</Label>
        <Input
          ref={ref}
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={cn(error && 'border-destructive focus-visible:ring-destructive', className)}
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
      </div>
    )
  },
)
TextInput.displayName = 'TextInput'
