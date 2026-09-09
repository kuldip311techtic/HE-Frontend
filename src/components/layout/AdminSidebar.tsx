import { NavLink } from 'react-router-dom';
import {
  BarChart3,
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
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3, enabled: true },
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
              className="flex items-center justify-between rounded-figma-10 px-3 py-2 text-muted-foreground opacity-60"
              aria-disabled="true"
            >
              <span className="inline-flex items-center gap-2 text-body-sm">
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
                'flex items-center gap-2 rounded-figma-10 px-3 py-2 text-body-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-figma-brand',
                isActive
                  ? 'bg-sidebar-accent/15 text-sidebar-accent'
                  : 'text-sidebar-foreground hover:bg-muted/40',
              )
            }
          >
            <Icon className="h-4 w-4" aria-hidden />
            {item.label}
          </NavLink>
        );
      })}
    </nav>
  );
}
