import {
  normalizeQuickAccessLink,
  unwrapQuickAccessLinks,
} from "@/lib/quick-access-helpers";
import { apiRequest } from "@/services/api-client";
import type {
  QuickAccessLink,
  QuickAccessLinkApiItem,
  QuickAccessResponse,
} from "@/types/quick-access";

const QUICK_ACCESS_PATH = "/api/super-admin/quick-access";

export async function fetchQuickAccessLinks(): Promise<QuickAccessLink[]> {
  const response = await apiRequest<
    QuickAccessResponse | QuickAccessLinkApiItem[]
  >(QUICK_ACCESS_PATH, {
    method: "GET",
    auth: true,
  });

  return unwrapQuickAccessLinks(response ?? []).map(normalizeQuickAccessLink);
}
