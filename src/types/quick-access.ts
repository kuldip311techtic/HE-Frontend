export type QuickAccessLinkStatus =
  | "active"
  | "inactive"
  | "pending"
  | "new"
  | "warning"
  | string;

export interface QuickAccessLink {
  id: string;
  label: string;
  href: string;
  description?: string;
  status?: QuickAccessLinkStatus;
  icon?: string;
}

export interface QuickAccessLinkRaw {
  id?: string;
  label?: string;
  name?: string;
  title?: string;
  href?: string;
  link?: string;
  path?: string;
  description?: string;
  status?: QuickAccessLinkStatus;
  icon?: string;
}

export interface QuickAccessResponse {
  data?: QuickAccessLinkRaw[];
  items?: QuickAccessLinkRaw[];
  links?: QuickAccessLinkRaw[];
  results?: QuickAccessLinkRaw[];
}
