import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

export function isAdminRole(role: string): boolean {
  const normalized = role.toLowerCase().replace(/[\s_-]+/g, '_');
  return normalized === 'admin' || normalized === 'super_admin';
}

export function hasAdminAccess(roles: string[]): boolean {
  return roles.some((role) => isAdminRole(role));
}
