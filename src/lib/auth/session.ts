import { SUPER_ADMIN_ROLE, isAdminRole } from '../../types/auth';
import type { LoginResponse } from '../../types/api';
import {
  AUTH_EMAIL_STORAGE_KEY,
  AUTH_REFRESH_TOKEN_STORAGE_KEY,
  AUTH_ROLE_STORAGE_KEY,
  AUTH_TOKEN_STORAGE_KEY,
  AUTH_TOKEN_TYPE_STORAGE_KEY,
} from './constants';

export {
  AUTH_EMAIL_STORAGE_KEY,
  AUTH_REFRESH_TOKEN_STORAGE_KEY,
  AUTH_ROLE_STORAGE_KEY,
  AUTH_TOKEN_STORAGE_KEY,
  AUTH_TOKEN_TYPE_STORAGE_KEY,
} from './constants';

export function getStoredToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
}

export function getStoredEmail(): string | null {
  return localStorage.getItem(AUTH_EMAIL_STORAGE_KEY);
}

export function getStoredRole(): string | null {
  return localStorage.getItem(AUTH_ROLE_STORAGE_KEY);
}

export function isAuthenticated(): boolean {
  return Boolean(getStoredToken());
}

export function hasAdminAccess(): boolean {
  if (!isAuthenticated()) {
    return false;
  }

  const role = getStoredRole();
  if (!role) {
    return true;
  }

  return isAdminRole(role);
}

export function clearAuth(): void {
  localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  localStorage.removeItem(AUTH_REFRESH_TOKEN_STORAGE_KEY);
  localStorage.removeItem(AUTH_TOKEN_TYPE_STORAGE_KEY);
  localStorage.removeItem(AUTH_EMAIL_STORAGE_KEY);
  localStorage.removeItem(AUTH_ROLE_STORAGE_KEY);
}

export function persistSession(response: LoginResponse): void {
  const { access_token, refresh_token, token_type, email } = response.data;
  const resolvedEmail = email || response.email;

  localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, access_token);
  localStorage.setItem(AUTH_REFRESH_TOKEN_STORAGE_KEY, refresh_token);
  localStorage.setItem(AUTH_TOKEN_TYPE_STORAGE_KEY, token_type || 'bearer');
  localStorage.setItem(AUTH_ROLE_STORAGE_KEY, SUPER_ADMIN_ROLE);

  if (resolvedEmail) {
    localStorage.setItem(AUTH_EMAIL_STORAGE_KEY, resolvedEmail);
  }
}
