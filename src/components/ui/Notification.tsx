type NotificationVariant = 'success' | 'error' | 'info';

interface NotificationProps {
  message: string;
  variant?: NotificationVariant;
  id?: string;
}

const variantClassName: Record<NotificationVariant, string> = {
  success: 'border-success/30 bg-success-soft text-success',
  error: 'border-danger/30 bg-danger-soft text-danger',
  info: 'border-info/30 bg-accent-soft text-info',
};

const variantLiveMode: Record<
  NotificationVariant,
  { role: 'alert' | 'status'; ariaLive: 'assertive' | 'polite' }
> = {
  success: { role: 'status', ariaLive: 'polite' },
  error: { role: 'alert', ariaLive: 'assertive' },
  info: { role: 'status', ariaLive: 'polite' },
};

export default function Notification({
  message,
  variant = 'success',
  id,
}: NotificationProps) {
  if (!message) {
    return null;
  }

  const liveMode = variantLiveMode[variant];

  return (
    <div
      id={id}
      role={liveMode.role}
      aria-live={liveMode.ariaLive}
      className={`rounded-xl border px-4 py-3 text-sm leading-5 ${variantClassName[variant]}`}
    >
      {message}
    </div>
  );
}
