interface ToastProps {
  message: string;
  variant?: 'success' | 'error';
  onDismiss: () => void;
}

export default function Toast({
  message,
  variant = 'success',
  onDismiss,
}: ToastProps) {
  const variantClass =
    variant === 'success'
      ? 'border-success/30 bg-success/10 text-success'
      : 'border-danger/30 bg-danger-soft text-danger';

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-4 right-4 z-50 flex max-w-sm items-start gap-3 rounded-xl border px-4 py-3 shadow-card sm:bottom-6 sm:right-6 ${variantClass}`}
    >
      <p className="flex-1 text-sm leading-5">{message}</p>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-current transition hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <span aria-hidden="true">×</span>
      </button>
    </div>
  );
}
