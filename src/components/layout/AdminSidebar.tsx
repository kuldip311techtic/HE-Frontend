import { LayoutDashboard, Building2, Users, CreditCard, LifeBuoy, Menu, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { HoopsEngineWordmark } from '@/components/layout/HoopsEngineWordmark';
import { Button } from '@/components/ui/button';

const navItems = [
  { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard, enabled: true },
  { label: 'Organizations', to: '/admin/organizations', icon: Building2, enabled: true },
  { label: 'Users', to: '/admin/users', icon: Users, enabled: true },
  { label: 'Subscriptions', to: '/admin/subscriptions', icon: CreditCard, enabled: true },
  { label: 'Support Requests', to: '/admin/support-requests', icon: LifeBuoy, enabled: true },
];

interface AdminSidebarProps {
  mobileOpen: boolean;
  onMobileToggle: () => void;
}

export function AdminSidebar({ mobileOpen, onMobileToggle }: AdminSidebarProps) {
  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/50 lg:hidden',
          mobileOpen ? 'block' : 'hidden',
        )}
        onClick={onMobileToggle}
        aria-hidden="true"
      />
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-[var(--layout-sidebar-width)] flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-transform lg:static lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
      >
        <div className="flex h-[var(--layout-header-height)] items-center justify-between border-b border-sidebar-border px-[var(--space-4)]">
          <HoopsEngineWordmark />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="lg:hidden text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
            onClick={onMobileToggle}
            aria-label="Close navigation menu"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <nav aria-label="Admin navigation" className="flex-1 space-y-1 p-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            if (!item.enabled) {
              return (
                <span
                  key={item.label}
                  aria-disabled="true"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/50 cursor-not-allowed"
                >
                  <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {item.label}
                </span>
              );
            }

            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => mobileOpen && onMobileToggle()}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent/80',
                  )
                }
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </aside>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="fixed left-4 top-3 z-30 lg:hidden"
        onClick={onMobileToggle}
        aria-label="Open navigation menu"
      >
        <Menu className="h-5 w-5" />
      </Button>
    </>
  );
}
