import { cn } from '@/lib/utils';

interface ErrorMessageProps {
  message: string;
  className?: string;
}

export function ErrorMessage({ message, className }: ErrorMessageProps) {
  return (
    <p role="alert" className={cn('text-sm font-medium text-destructive', className)}>
      {message}
    </p>
  );
}
