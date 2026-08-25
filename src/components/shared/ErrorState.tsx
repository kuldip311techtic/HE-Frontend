import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export default function ErrorState({
  title = 'Unable to load data',
  message,
  onRetry,
  retryLabel = 'Retry',
}: ErrorStateProps) {
  return (
    <Card role="alert" className="border-destructive/30">
      <CardContent className="flex flex-col items-center gap-4 py-12 text-center sm:flex-row sm:text-left">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle
            className="h-6 w-6 text-destructive"
            aria-hidden="true"
          />
        </div>
        <div className="flex-1">
          <p className="text-lg font-semibold text-foreground">{title}</p>
          <p className="mt-1 text-sm text-muted-foreground">{message}</p>
        </div>
        {onRetry ? (
          <Button
            type="button"
            variant="outline"
            onClick={onRetry}
            aria-label={retryLabel}
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            {retryLabel}
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}
