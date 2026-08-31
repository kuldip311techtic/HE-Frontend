export const USER_ROLES = ['coach', 'player'] as const

export type UserRole = (typeof USER_ROLES)[number]

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

export function formatUserName(user: {
  name?: string
  first_name?: string
  last_name?: string
}): string {
  if (user.name?.trim()) {
    return user.name.trim()
  }

  return [user.first_name, user.last_name].filter(Boolean).join(' ').trim()
}

export function isDuplicateEmailError(message: string): boolean {
  const lower = message.toLowerCase()
  return (
    lower.includes('duplicate') ||
    lower.includes('already exists') ||
    lower.includes('already registered')
  )
}
