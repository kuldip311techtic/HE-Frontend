export const DEMO_AUTH_TOKEN = "demo-admin-token";

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
