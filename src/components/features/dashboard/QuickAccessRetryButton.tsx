import { Button } from '@/components/ui/button';

/** Compact retry control used in the Quick Access section header. */
export function QuickAccessRetryButton({
  onRetry,
  isRetrying,
}: {
  onRetry: () => void;
  isRetrying: boolean;
}) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onRetry}
      isLoading={isRetrying}
      disabled={isRetrying}
      className="quick-access-retry-btn"
    >
      Retry
    </Button>
  );
}
