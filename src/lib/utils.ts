import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDateTime(value: string | null | undefined): string {
  if (!value) return '—'
  try {
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(value))
  } catch {
    return '—'
  }
}

export function formatDisplayName(
  firstName: string | null | undefined,
  lastName: string | null | undefined,
  fallback?: string | null,
): string {
  if (fallback) return fallback
  const parts = [firstName, lastName].filter(Boolean)
  return parts.length > 0 ? parts.join(' ') : '—'
}

export function splitFullName(name: string): {
  first_name: string
  last_name: string
} {
  const trimmed = name.trim()
  const spaceIndex = trimmed.indexOf(' ')
  if (spaceIndex === -1) {
    return { first_name: trimmed, last_name: '' }
  }
  return {
    first_name: trimmed.slice(0, spaceIndex),
    last_name: trimmed.slice(spaceIndex + 1).trim(),
  }
}

export const DEFAULT_USER_ROLES = [
  { value: 'coach', label: 'Coach', description: 'Coach account' },
  { value: 'player', label: 'Player', description: 'Player account' },
] as const
