import { cn } from '@/lib/utils/cn';

interface ErrorMessageProps {
  message: string;
  className?: string;
}

export function ErrorMessage({ message, className }: ErrorMessageProps) {
  return (
    <p role="alert" className={cn('text-body-sm text-destructive', className)}>
      {message}
    </p>
  );
}
