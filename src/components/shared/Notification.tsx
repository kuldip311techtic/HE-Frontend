import { toast } from 'sonner';

export type NotificationType = 'success' | 'error';

export function notify(type: NotificationType, message: string): void {
  if (type === 'success') {
    toast.success(message);
    return;
  }

  toast.error(message);
}

const Notification = {
  success: (message: string) => notify('success', message),
  error: (message: string) => notify('error', message),
};

export default Notification;
