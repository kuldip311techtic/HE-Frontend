import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function splitFullName(name: string): { first_name: string; last_name: string } {
  const trimmed = name.trim();
  const spaceIndex = trimmed.indexOf(' ');
  if (spaceIndex === -1) {
    return { first_name: trimmed, last_name: '' };
  }
  return {
    first_name: trimmed.slice(0, spaceIndex),
    last_name: trimmed.slice(spaceIndex + 1).trim(),
  };
}

export function formatUserDisplayName(user: {
  name?: string | null;
  first_name?: string | null;
  last_name?: string | null;
}): string {
  if (user.name?.trim()) {
    return user.name.trim();
  }
  const parts = [user.first_name, user.last_name].filter(Boolean);
  return parts.join(' ').trim() || '—';
}
