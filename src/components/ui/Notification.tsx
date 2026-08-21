import type { NotificationVariant } from "@/context/toast-context";

interface NotificationProps {
  variant: NotificationVariant;
  message: string;
  onDismiss?: () => void;
}

const variantClass: Record<NotificationVariant, string> = {
  success: "border-success bg-success-background text-success",
  error: "border-error-border bg-error-background text-error",
};

export function Notification({
  variant,
  message,
  onDismiss,
}: NotificationProps) {
  const isError = variant === "error";

  return (
    <div
      role={isError ? "alert" : "status"}
      aria-live={isError ? "assertive" : "polite"}
      className={`flex items-start gap-3 rounded-md border px-4 py-3 text-sm shadow-md ${variantClass[variant]}`}
    >
      <p className="min-w-0 flex-1 font-medium">{message}</p>
      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          className="inline-flex min-h-touch min-w-touch shrink-0 items-center justify-center rounded-md text-current hover:bg-surface/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-focus focus-visible:ring-offset-2"
          aria-label="Dismiss notification"
        >
          <span aria-hidden="true">×</span>
        </button>
      ) : null}
    </div>
  );
}
