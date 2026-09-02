import {
  BarChart3,
  Building2,
  CreditCard,
  HeadphonesIcon,
  Users,
  type LucideIcon,
} from "lucide-react";

import type {
  QuickAccessLink,
  QuickAccessLinkRaw,
  QuickAccessResponse,
} from "@/types/quick-access";

const ICON_MAP: Record<string, LucideIcon> = {
  organizations: Building2,
  users: Users,
  subscriptions: CreditCard,
  analytics: BarChart3,
  support: HeadphonesIcon,
};

function normalizeHref(rawHref: string): string {
  if (rawHref.startsWith("/")) {
    return rawHref;
  }

  return `/${rawHref.replace(/^\//, "")}`;
}

function inferIconKey(label: string, href: string): string {
  const haystack = `${label} ${href}`.toLowerCase();

  if (haystack.includes("organization")) return "organizations";
  if (haystack.includes("user")) return "users";
  if (haystack.includes("subscription")) return "subscriptions";
  if (haystack.includes("analytics")) return "analytics";
  if (haystack.includes("support")) return "support";

  return "organizations";
}

export function normalizeQuickAccessLink(
  link: QuickAccessLinkRaw,
  index: number,
): QuickAccessLink {
  const rawHref = link.href || link.link || link.path || "";
  const href = rawHref ? normalizeHref(rawHref) : `/super-admin/dashboard`;
  const label =
    link.label?.trim() ||
    link.name?.trim() ||
    link.title?.trim() ||
    `Module ${index + 1}`;

  return {
    id: link.id || `${index}-${label}`,
    label,
    href,
    description: link.description?.trim(),
    status: link.status ?? "active",
    icon: link.icon,
  };
}

export function unwrapQuickAccessLinks(
  response: QuickAccessResponse | QuickAccessLinkRaw[],
): QuickAccessLink[] {
  if (Array.isArray(response)) {
    return response.map(normalizeQuickAccessLink);
  }

  const candidates =
    response.data ??
    response.items ??
    response.links ??
    response.results ??
    [];

  return candidates.map(normalizeQuickAccessLink);
}

export function getQuickAccessIcon(link: QuickAccessLink): LucideIcon {
  if (link.icon && ICON_MAP[link.icon.toLowerCase()]) {
    return ICON_MAP[link.icon.toLowerCase()];
  }

  return ICON_MAP[inferIconKey(link.label, link.href)] ?? Building2;
}

export function formatQuickAccessStatus(status: string): string {
  return status
    .split(/[_-]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
