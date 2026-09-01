import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15;
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function isActiveStatus(status: string): boolean {
  return status.toLowerCase() === "active";
}

export function formatRoleLabel(role: string): string {
  const lower = role.toLowerCase();
  if (lower === "coach") return "Coach";
  if (lower === "player") return "Player";
  return role.charAt(0).toUpperCase() + role.slice(1);
}

export function splitFullName(name: string): {
  first_name: string;
  last_name: string;
} {
  const trimmed = name.trim();
  const spaceIndex = trimmed.indexOf(" ");
  if (spaceIndex === -1) {
    return { first_name: trimmed, last_name: "" };
  }
  return {
    first_name: trimmed.slice(0, spaceIndex),
    last_name: trimmed.slice(spaceIndex + 1).trim(),
  };
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function getSupportRequestUserLabel(request: {
  user?: string | null;
  user_name?: string | null;
  user_email?: string | null;
}): string {
  return (
    request.user_name ??
    request.user ??
    request.user_email ??
    "Unknown user"
  );
}

export function getSupportRequestDate(request: {
  created_at?: string | null;
  request_date?: string | null;
}): string | null {
  return request.created_at ?? request.request_date ?? null;
}

export function isOpenSupportRequest(status: string): boolean {
  const lower = status.toLowerCase();
  return lower === "open" || lower === "pending";
}
