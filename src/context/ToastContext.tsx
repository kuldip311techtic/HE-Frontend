import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { Notification } from "@/components/ui/Notification";
import {
  ToastContext,
  type NotificationItem,
  type NotificationVariant,
  type ToastContextValue,
} from "@/context/toast-context";

const SUCCESS_DISMISS_MS = 5000;
let notificationSeq = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const timers = useRef(new Map<string, number>());

  const dismiss = useCallback((id: string) => {
    const timer = timers.current.get(id);
    if (timer !== undefined) {
      window.clearTimeout(timer);
      timers.current.delete(id);
    }
    setNotifications((current) => current.filter((item) => item.id !== id));
  }, []);

  const notify = useCallback(
    (variant: NotificationVariant, message: string) => {
      notificationSeq += 1;
      const id = `notification-${notificationSeq}`;
      setNotifications((current) => [...current, { id, variant, message }]);

      if (variant === "success") {
        const timer = window.setTimeout(() => {
          dismiss(id);
        }, SUCCESS_DISMISS_MS);
        timers.current.set(id, timer);
      }
    },
    [dismiss],
  );

  useEffect(() => {
    const timerMap = timers.current;
    return () => {
      timerMap.forEach((timer) => window.clearTimeout(timer));
      timerMap.clear();
    };
  }, []);

  const value = useMemo<ToastContextValue>(
    () => ({ notify, dismiss }),
    [notify, dismiss],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-4 top-4 z-50 flex flex-col gap-3 sm:inset-x-auto sm:right-4 sm:w-full sm:max-w-sm">
        {notifications.map((item) => (
          <div key={item.id} className="pointer-events-auto">
            <Notification
              variant={item.variant}
              message={item.message}
              onDismiss={() => dismiss(item.id)}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
