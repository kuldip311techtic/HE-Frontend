import {
  normalizeQuickAccessLink,
  unwrapQuickAccessLinks,
} from "@/lib/quick-access-helpers";
import { apiRequest } from "@/services/api-client";
import {
  QUICK_ACCESS_API_PATH,
  type QuickAccessLink,
  type QuickAccessLinkApiItem,
  type QuickAccessResponse,
} from "@/types/quick-access";

/** Recorded API contract endpoint for GET quick-access module links. */
export const QUICK_ACCESS_ENDPOINT = QUICK_ACCESS_API_PATH;

/** Fetches quick-access links from GET /api/super-admin/quick-access. */
export async function fetchQuickAccessLinks(): Promise<QuickAccessLink[]> {
  const response = await apiRequest<
    QuickAccessResponse | QuickAccessLinkApiItem[]
  >(QUICK_ACCESS_API_PATH, {
    method: "GET",
    auth: true,
  });

  return unwrapQuickAccessLinks(response ?? []).map(normalizeQuickAccessLink);
}
