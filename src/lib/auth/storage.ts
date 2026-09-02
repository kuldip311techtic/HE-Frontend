const AUTH_TOKEN_KEY = "hoops_admin_token";
const AUTH_USER_KEY = "hoops_admin_user";
/** Luna token auth default storage_key when project auth_config omits storage_key */
const LUNA_TOKEN_FALLBACK_KEY = "auth_token";

export function getStoredToken(): string | null {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (token) return token;

  const lunaToken = localStorage.getItem(LUNA_TOKEN_FALLBACK_KEY);
  if (!lunaToken) return null;

  localStorage.setItem(AUTH_TOKEN_KEY, lunaToken);
  localStorage.removeItem(LUNA_TOKEN_FALLBACK_KEY);
  return lunaToken;
}

export function setStoredToken(token: string): void {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.removeItem(LUNA_TOKEN_FALLBACK_KEY);
}

export function clearStoredToken(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(LUNA_TOKEN_FALLBACK_KEY);
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
