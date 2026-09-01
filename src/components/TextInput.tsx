import * as React from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface TextInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  containerClassName?: string;
}

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, error, id, className, containerClassName, ...props }, ref) => {
    const inputId = id ?? props.name;

    return (
      <div className={cn("space-y-2", containerClassName)}>
        <Label htmlFor={inputId} className="text-sm font-medium text-foreground">
          {label}
        </Label>
        <Input
          ref={ref}
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={cn(
            "min-h-11 bg-card/80",
            error && "border-destructive focus-visible:ring-destructive",
            className,
          )}
          {...props}
        />
        {error ? (
          <p
            id={`${inputId}-error`}
            role="alert"
            className="text-sm text-destructive"
          >
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);

TextInput.displayName = "TextInput";
