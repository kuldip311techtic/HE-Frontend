import { DEMO_ADMIN_USER } from '@/hooks/auth-context';
import type { AuthSession } from '@/types/auth';

export function shouldAutoDemoAuth(): boolean {
  return import.meta.env.VITE_AUTO_DEMO_AUTH === 'true';
}

export function getAutoDemoSession(): AuthSession | null {
  if (!shouldAutoDemoAuth()) {
    return null;
  }

  return {
    token: 'demo-admin-token',
    user: DEMO_ADMIN_USER,
  };
}
