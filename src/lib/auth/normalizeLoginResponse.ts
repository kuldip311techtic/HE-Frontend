import { normalizeAdminRole } from '@/lib/auth/normalizeAdminRole';
import type { AdminSession } from '@/types/auth';
import type { SuperAdminLoginResponse } from '@/types/api';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function readToken(record: Record<string, unknown>): string | null {
  const candidates = ['token', 'access_token', 'jwt', 'accessToken'];
  for (const key of candidates) {
    const value = record[key];
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
  }
  return null;
}

export function normalizeLoginResponse(
  data: SuperAdminLoginResponse | Record<string, unknown>,
  fallbackEmail: string,
): AdminSession {
  const record = isRecord(data) ? data : {};
  const token = readToken(record);
  if (!token) {
    throw new Error('Invalid login response: missing authentication token.');
  }

  const email =
    (typeof record.email === 'string' && record.email.trim()) || fallbackEmail.trim();
  const name =
    (typeof record.name === 'string' && record.name.trim()) ||
    email.split('@')[0] ||
    'Super Admin';

  const rawRole = typeof record.role === 'string' ? record.role : 'super_admin';
  const normalizedRole = normalizeAdminRole(rawRole) ?? normalizeAdminRole('super_admin');
  if (!normalizedRole) {
    throw new Error('Invalid login response: unrecognized role.');
  }

  return {
    token,
    role: normalizedRole,
    email,
    name,
  };
}
