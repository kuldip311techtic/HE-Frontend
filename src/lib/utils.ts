import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const AUTH_TOKEN_KEY = "super_admin_token";
export const AUTH_EMAIL_KEY = "super_admin_email";

export function getStoredToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function getStoredEmail(): string | null {
  return localStorage.getItem(AUTH_EMAIL_KEY);
}

export function setStoredEmail(email: string): void {
  localStorage.setItem(AUTH_EMAIL_KEY, email);
}

export function clearStoredToken(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_EMAIL_KEY);
}
