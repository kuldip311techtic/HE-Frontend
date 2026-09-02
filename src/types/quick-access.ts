/**
 * API contract: GET /api/super-admin/quick-access
 * - Auth: Bearer token (super-admin session)
 * - Success (200): `QuickAccessLinkApiItem[]` or `QuickAccessResponse` envelope
 *   (`data`, `items`, `links`, or `results`)
 * - Normalized client-side to `QuickAccessLink[]` by `fetchQuickAccessLinks`
 */
export const QUICK_ACCESS_API_PATH = "/api/super-admin/quick-access" as const;

export type QuickAccessLinkStatus =
  | "active"
  | "available"
  | "inactive"
  | "disabled"
  | "new"
  | "pending"
  | "warning"
  | "error"
  | string;

export interface QuickAccessLink {
  id: string;
  label: string;
  description: string;
  path: string;
  status: QuickAccessLinkStatus;
}

export interface QuickAccessLinkApiItem {
  id?: string;
  label?: string;
  title?: string;
  name?: string;
  description?: string;
  path?: string;
  link?: string;
  href?: string;
  status?: QuickAccessLinkStatus;
}

export interface QuickAccessResponse {
  data?: QuickAccessLinkApiItem[];
  items?: QuickAccessLinkApiItem[];
  links?: QuickAccessLinkApiItem[];
  results?: QuickAccessLinkApiItem[];
}
