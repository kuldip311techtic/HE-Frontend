import type {
  QuickAccessLink,
  QuickAccessLinkApiItem,
  QuickAccessLinkStatus,
  QuickAccessResponse,
} from "@/types/quick-access";

const LIST_UNWRAP_KEYS = ["data", "items", "links", "results"] as const;

export function unwrapQuickAccessLinks(
  response: QuickAccessResponse | QuickAccessLinkApiItem[],
): QuickAccessLinkApiItem[] {
  if (Array.isArray(response)) {
    return response;
  }

  for (const key of LIST_UNWRAP_KEYS) {
    const value = response[key];
    if (Array.isArray(value)) {
      return value;
    }
  }

  return [];
}

function resolveLabel(item: QuickAccessLinkApiItem, index: number): string {
  return item.label ?? item.title ?? item.name ?? `Module ${index + 1}`;
}

function resolvePath(item: QuickAccessLinkApiItem): string {
  const rawPath = item.path ?? item.link ?? item.href ?? "";
  if (rawPath.startsWith("/")) {
    return rawPath;
  }

  if (rawPath.length > 0) {
    return `/${rawPath.replace(/^\//, "")}`;
  }

  return "/super-admin/dashboard";
}

export function normalizeQuickAccessLink(
  item: QuickAccessLinkApiItem,
  index: number,
): QuickAccessLink {
  return {
    id: item.id ?? `quick-access-${index}`,
    label: resolveLabel(item, index),
    description: item.description ?? "",
    path: resolvePath(item),
    status: item.status ?? "active",
  };
}

export function formatQuickAccessStatus(status: QuickAccessLinkStatus): string {
  return status
    .split(/[_-]/)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

export function getQuickAccessStatusVariant(
  status: QuickAccessLinkStatus,
): "default" | "secondary" | "destructive" | "outline" | "success" | "warning" {
  const normalized = status.toLowerCase();

  if (["active", "available", "enabled", "online"].includes(normalized)) {
    return "success";
  }

  if (["new", "updated"].includes(normalized)) {
    return "default";
  }

  if (["pending", "warning", "attention"].includes(normalized)) {
    return "warning";
  }

  if (["error", "critical", "offline"].includes(normalized)) {
    return "destructive";
  }

  if (["inactive", "disabled", "unavailable"].includes(normalized)) {
    return "secondary";
  }

  return "outline";
}
