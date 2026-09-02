import { AlertCircle } from "lucide-react";

import { cn } from "@/lib/utils";

interface ErrorMessageProps {
  message: string;
  className?: string;
  id?: string;
}

export function ErrorMessage({ message, className, id }: ErrorMessageProps) {
  if (!message) return null;

  return (
    <div
      id={id}
      role="alert"
      aria-live="assertive"
      className={cn(
        "flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive",
        className
      )}
    >
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <p>{message}</p>
    </div>
  );
}
