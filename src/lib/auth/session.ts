import { SESSION_STORAGE_KEY } from '@/lib/auth/constants';
import { normalizeAdminRole } from '@/lib/auth/normalizeAdminRole';
import type { AdminSession } from '@/types/auth';

function parseSession(raw: string): AdminSession | null {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;

    const record = parsed as Record<string, unknown>;
    const token = record.token;
    const email = record.email;
    const name = record.name;
    const role = record.role;

    if (typeof token !== 'string' || typeof email !== 'string' || typeof name !== 'string') {
      return null;
    }

    if (typeof role !== 'string') return null;

    const normalizedRole = normalizeAdminRole(role);
    if (!normalizedRole) return null;

    return { token, role: normalizedRole, email, name };
  } catch {
    return null;
  }
}

export function getSession(): AdminSession | null {
  try {
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    return parseSession(raw);
  } catch {
    return null;
  }
}

export function setSession(session: AdminSession): void {
  const normalizedRole = normalizeAdminRole(session.role);
  if (!normalizedRole) {
    throw new Error('Invalid admin role.');
  }

  const normalized: AdminSession = {
    token: session.token.trim(),
    email: session.email.trim(),
    name: session.name.trim(),
    role: normalizedRole,
  };

  sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(normalized));
}

export function clearSession(): void {
  sessionStorage.removeItem(SESSION_STORAGE_KEY);
}
