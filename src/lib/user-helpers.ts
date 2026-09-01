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

export function getDisplayName(user: {
  name?: string | null
  first_name?: string | null
  last_name?: string | null
}): string {
  if (user.name?.trim()) {
    return user.name.trim()
  }
  const parts = [user.first_name, user.last_name].filter(Boolean)
  return parts.join(' ') || '—'
}

export function getFieldErrorMessage(
  details: { field: string; message: string }[] | undefined,
  field: string,
): string | undefined {
  return details?.find((detail) => detail.field === field)?.message
}

export function buildCreatePayload(values: {
  name: string
  email: string
  role: string
  password: string
}) {
  const { first_name, last_name } = splitFullName(values.name)
  return {
    first_name,
    last_name,
    name: values.name.trim(),
    email: values.email.trim(),
    password: values.password,
    role: values.role,
  }
}

export function buildUpdatePayload(values: {
  name: string
  email: string
  role: string
  password?: string
}) {
  const { first_name, last_name } = splitFullName(values.name)
  const payload: {
    first_name: string
    last_name: string
    name: string
    email: string
    role: string
    password?: string
  } = {
    first_name,
    last_name,
    name: values.name.trim(),
    email: values.email.trim(),
    role: values.role,
  }

  if (values.password?.trim()) {
    payload.password = values.password.trim()
  }

  return payload
}
