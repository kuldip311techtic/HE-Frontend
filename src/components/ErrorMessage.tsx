import { AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ErrorMessageProps {
  message: string
  className?: string
}

export function ErrorMessage({ message, className }: ErrorMessageProps) {
  if (!message) return null

  return (
    <div
      role="alert"
      aria-live="polite"
      className={cn(
        'flex items-start gap-2 rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive',
        className,
      )}
    >
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <span>{message}</span>
    </div>
  )
}
