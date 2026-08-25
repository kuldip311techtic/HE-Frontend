import { AlertCircle, AlertTriangle, CheckCircle2 } from "lucide-react";

import { cn } from "@/lib/utils";

type NotificationVariant = "success" | "error" | "warning";

interface NotificationProps {
  message: string;
  variant?: NotificationVariant;
  className?: string;
}

const variantStyles: Record<
  NotificationVariant,
  { container: string; icon: typeof AlertCircle }
> = {
  success: {
    container:
      "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    icon: CheckCircle2,
  },
  error: {
    container: "border-destructive/30 bg-destructive/10 text-destructive",
    icon: AlertCircle,
  },
  warning: {
    container:
      "border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-400",
    icon: AlertTriangle,
  },
};

export function Notification({
  message,
  variant = "error",
  className,
}: NotificationProps) {
  if (!message) {
    return null;
  }

  const { container, icon: Icon } = variantStyles[variant];

  return (
    <div
      role="alert"
      aria-live={variant === "error" ? "assertive" : "polite"}
      className={cn(
        "flex items-start gap-2 rounded-md border px-4 py-3 text-sm",
        container,
        className,
      )}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <p>{message}</p>
    </div>
  );
}
