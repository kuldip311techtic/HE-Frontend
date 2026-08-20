import { SUPER_ADMIN_ROLE, isAdminRole } from '../../types/auth';
import type { LoginResponse } from '../../types/api';

export const AUTH_TOKEN_STORAGE_KEY = 'token';
export const AUTH_TOKEN_TYPE_STORAGE_KEY = 'token_type';
export const AUTH_EMAIL_STORAGE_KEY = 'auth_email';
export const AUTH_ROLE_STORAGE_KEY = 'auth_role';

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
  localStorage.removeItem(AUTH_TOKEN_TYPE_STORAGE_KEY);
  localStorage.removeItem(AUTH_EMAIL_STORAGE_KEY);
  localStorage.removeItem(AUTH_ROLE_STORAGE_KEY);
}

export function persistSession(response: LoginResponse): void {
  const token = response.data.token || response.token;
  const tokenType = response.data.token_type || 'bearer';
  const email = response.data.email || response.email;

  localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
  localStorage.setItem(AUTH_TOKEN_TYPE_STORAGE_KEY, tokenType);
  localStorage.setItem(AUTH_ROLE_STORAGE_KEY, SUPER_ADMIN_ROLE);

  if (email) {
    localStorage.setItem(AUTH_EMAIL_STORAGE_KEY, email);
  }
}
