import { NavLink } from 'react-router-dom';
import {
  Building2,
  CreditCard,
  LayoutDashboard,
  LifeBuoy,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Badge } from '@/components/ui/badge';

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, enabled: true },
  { to: '/admin/organizations', label: 'Organizations', icon: Building2, enabled: true },
  { to: '/admin/users', label: 'Users', icon: Users, enabled: true },
  { to: '/admin/subscriptions', label: 'Subscriptions', icon: CreditCard, enabled: true },
  { to: '/admin/support', label: 'Support', icon: LifeBuoy, enabled: true },
];

interface AdminSidebarProps {
  onNavigate?: () => void;
}

export function AdminSidebar({ onNavigate }: AdminSidebarProps) {
  return (
    <nav aria-label="Admin navigation" className="flex h-full flex-col gap-1 p-4">
      <div className="mb-4 px-2">
        <p className="font-outfit text-lg font-semibold text-foreground">Hoops Engine</p>
        <p className="text-body-sm text-muted-foreground">Super Admin</p>
      </div>
      {navItems.map((item) => {
        const Icon = item.icon;
        if (!item.enabled) {
          return (
            <div
              key={item.to}
              className="flex items-center justify-between rounded-full px-3.5 py-[11px] text-muted-foreground opacity-60"
              aria-disabled="true"
            >
              <span className="inline-flex items-center gap-3 text-body-sm">
                <Icon className="h-4 w-4" aria-hidden />
                {item.label}
              </span>
              <Badge variant="secondary">Coming soon</Badge>
            </div>
          );
        }

        return (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'group relative flex items-center gap-3 rounded-full px-3.5 py-[11px] font-outfit text-sm font-medium transition-[background,color] duration-150 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-figma-brand',
                isActive
                  ? 'bg-[rgba(184,255,60,0.16)] text-primary'
                  : 'text-[#d7e0d9] hover:bg-[rgba(184,255,60,0.1)] hover:text-primary',
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  className={cn(
                    'h-4 w-4 shrink-0 transition-colors',
                    isActive ? 'text-primary' : 'text-[#c5d2c8] group-hover:text-primary',
                  )}
                  aria-hidden
                />
                <span className="flex-1">{item.label}</span>
                {isActive ? (
                  <span
                    className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary shadow-[0_0_8px_rgba(184,255,60,0.8)]"
                    aria-hidden
                  />
                ) : null}
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}
