const AUTH_TOKEN_KEY = 'he_admin_auth_token';
const AUTH_USER_KEY = 'he_admin_auth_user';

export function getStoredToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function clearStoredToken(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

export function getStoredUserRaw(): string | null {
  return localStorage.getItem(AUTH_USER_KEY);
}

export function setStoredUserRaw(userJson: string): void {
  localStorage.setItem(AUTH_USER_KEY, userJson);
}

export function clearStoredUser(): void {
  localStorage.removeItem(AUTH_USER_KEY);
}

export function clearAuthStorage(): void {
  clearStoredToken();
  clearStoredUser();
}
