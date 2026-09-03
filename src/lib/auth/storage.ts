export const DEMO_AUTH_TOKEN = "demo-admin-token";
export const VALIDATION_AUTH_TOKEN = "luna-validation-token";
/** Session id/token used for contract GET probes during Luna validation. */
export const VALIDATION_SESSION_ID = "00000000-0000-4000-8000-000000000002";
export const VALIDATION_SESSION_TOKEN = "luna-validation-session-token";

const AUTH_TOKEN_KEY = "hoops_admin_token";
const AUTH_USER_KEY = "hoops_admin_user";

export function getStoredToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function clearStoredToken(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

export function isDemoAuthToken(): boolean {
  return getStoredToken() === DEMO_AUTH_TOKEN;
}

export function isValidationAuthToken(): boolean {
  return getStoredToken() === VALIDATION_AUTH_TOKEN;
}

export function getStoredUser<T>(): T | null {
  const raw = localStorage.getItem(AUTH_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function setStoredUser<T>(user: T): void {
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

export function clearStoredUser(): void {
  localStorage.removeItem(AUTH_USER_KEY);
}

export function clearAuthStorage(): void {
  clearStoredToken();
  clearStoredUser();
}
