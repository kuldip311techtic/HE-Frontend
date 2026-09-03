import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  Building2,
  CreditCard,
  LayoutDashboard,
  LifeBuoy,
  TrendingUp,
  Users,
} from 'lucide-react';

/** Routes that are registered in AppRoutes and navigable today. */
export const IMPLEMENTED_ADMIN_ROUTES = new Set<string>([
  '/admin',
  '/admin/organizations',
  '/admin/subscriptions',
]);

export interface SidebarNavItemDefinition {
  label: string;
  targetPath: string;
  icon: LucideIcon;
}

/** Canonical sidebar navigation — single source for AdminSidebar. */
export const SIDEBAR_NAV_ITEMS: SidebarNavItemDefinition[] = [
  { label: 'Dashboard', targetPath: '/admin', icon: LayoutDashboard },
  { label: 'Organizations', targetPath: '/admin/organizations', icon: Building2 },
  { label: 'Users', targetPath: '/admin/users', icon: Users },
  { label: 'Subscriptions', targetPath: '/admin/subscriptions', icon: CreditCard },
  { label: 'Support', targetPath: '/admin/support', icon: LifeBuoy },
];

export interface ModuleNavCardDefinition {
  title: string;
  description: string;
  targetPath: string;
  icon: LucideIcon;
}

/** Dashboard platform module cards — single source for ModuleNavCards. */
export const MODULE_NAV_CARDS: ModuleNavCardDefinition[] = [
  {
    title: 'Organizations',
    description: 'Manage organization accounts and settings.',
    targetPath: '/admin/organizations',
    icon: Building2,
  },
  {
    title: 'Coaches',
    description: 'View and manage platform coaches.',
    targetPath: '/admin/users',
    icon: Users,
  },
  {
    title: 'Players',
    description: 'View player accounts and activity.',
    targetPath: '/admin/users',
    icon: Activity,
  },
  {
    title: 'Subscriptions',
    description: 'Monitor subscription plans and billing.',
    targetPath: '/admin/subscriptions',
    icon: CreditCard,
  },
];

export function isAdminRouteImplemented(targetPath: string): boolean {
  return IMPLEMENTED_ADMIN_ROUTES.has(targetPath);
}

export function getModuleNavHref(targetPath: string): string | null {
  return isAdminRouteImplemented(targetPath) ? targetPath : null;
}

export type QuickAccessStatus = 'available' | 'coming_soon';

export interface QuickAccessLinkDefinition {
  module: string;
  targetPath: string;
  icon: LucideIcon;
  description: string;
}

/** Client-side fallback when GET /api/super-admin/quick-access is unavailable. */
export const QUICK_ACCESS_STATIC_LINKS: QuickAccessLinkDefinition[] = [
  {
    module: 'Manage Organizations',
    targetPath: '/admin/organizations',
    icon: Building2,
    description: 'Create and manage organization accounts.',
  },
  {
    module: 'Manage Users',
    targetPath: '/admin/users',
    icon: Users,
    description: 'View and manage platform users.',
  },
  {
    module: 'Subscriptions',
    targetPath: '/admin/subscriptions',
    icon: CreditCard,
    description: 'Monitor subscription plans and billing.',
  },
  {
    module: 'Analytics',
    targetPath: '/admin',
    icon: TrendingUp,
    description: 'Review platform metrics and performance.',
  },
  {
    module: 'Support Requests',
    targetPath: '/admin/support',
    icon: LifeBuoy,
    description: 'Review and respond to support inquiries.',
  },
];

const LINK_ALIASES: Record<string, string> = {
  '/manage-organizations': '/admin/organizations',
  '/admin/organizations': '/admin/organizations',
  '/manage-users': '/admin/users',
  '/admin/users': '/admin/users',
  '/subscriptions': '/admin/subscriptions',
  '/admin/subscriptions': '/admin/subscriptions',
  '/analytics': '/admin',
  '/admin/analytics': '/admin',
  '/admin': '/admin',
  '/support-requests': '/admin/support',
  '/support': '/admin/support',
  '/admin/support': '/admin/support',
};

/**
 * Map backend/ticket link values to canonical admin app routes.
 * Returns null when the link cannot be resolved to a known admin path.
 */
export function normalizeAdminRoute(link: string): string | null {
  const trimmed = link.trim();
  if (!trimmed) return null;

  const withLeadingSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  const normalized = withLeadingSlash.replace(/\/+$/, '') || '/';

  if (LINK_ALIASES[normalized]) {
    return LINK_ALIASES[normalized];
  }

  if (normalized.startsWith('/admin')) {
    return normalized;
  }

  return null;
}

export function getQuickAccessStatus(targetPath: string | null): QuickAccessStatus {
  if (!targetPath) return 'coming_soon';
  return IMPLEMENTED_ADMIN_ROUTES.has(targetPath) ? 'available' : 'coming_soon';
}

export function resolveQuickAccessIcon(module: string): LucideIcon {
  const match = QUICK_ACCESS_STATIC_LINKS.find(
    (item) => item.module.toLowerCase() === module.toLowerCase(),
  );
  if (match) return match.icon;

  const lowered = module.toLowerCase();
  if (lowered.includes('organization')) return Building2;
  if (lowered.includes('user')) return Users;
  if (lowered.includes('subscription')) return CreditCard;
  if (lowered.includes('analytics')) return TrendingUp;
  if (lowered.includes('support')) return LifeBuoy;

  return TrendingUp;
}

export function resolveQuickAccessDescription(module: string): string {
  const match = QUICK_ACCESS_STATIC_LINKS.find(
    (item) => item.module.toLowerCase() === module.toLowerCase(),
  );
  return match?.description ?? `Navigate to ${module}.`;
}
