import { createContext } from "react";

export type NotificationVariant = "success" | "error";

export interface NotificationItem {
  id: string;
  variant: NotificationVariant;
  message: string;
}

export interface ToastContextValue {
  notify: (variant: NotificationVariant, message: string) => void;
  dismiss: (id: string) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);
