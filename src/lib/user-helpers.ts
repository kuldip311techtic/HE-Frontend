import type { User } from "@/types/user";

export function getUserDisplayName(user: User): string {
  if (user.name?.trim()) {
    return user.name.trim();
  }

  return `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim() || "—";
}

export function normalizeRole(role: string): string {
  const normalized = role.trim().toLowerCase();

  if (normalized === "coach") {
    return "Coach";
  }

  if (normalized === "player") {
    return "Player";
  }

  return role;
}
