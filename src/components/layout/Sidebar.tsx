import { NavLink } from 'react-router-dom';
import {
  Building2,
  LayoutDashboard,
  PanelLeftClose,
  PanelLeftOpen,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/badge';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  {
    label: 'Dashboard',
    to: '/admin',
    icon: LayoutDashboard,
    end: true,
  },
  {
    label: 'Organizations',
    to: '/admin/organizations',
    icon: Building2,
    end: false,
  },
  {
    label: 'Users',
    to: '/admin/users',
    icon: Users,
    end: false,
  },
] as const;

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { user } = useAuth();

  return (
    <aside
      className={cn(
        'flex h-full flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-200',
        collapsed ? 'w-16' : 'w-64',
      )}
      aria-label="Admin navigation"
    >
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
        {!collapsed ? (
          <div className="flex flex-col">
            <span className="text-sm font-semibold">HE Admin</span>
            <span className="text-xs text-sidebar-foreground/70">
              Super Admin
            </span>
          </div>
        ) : (
          <span className="mx-auto text-sm font-bold">HE</span>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          onClick={onToggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <PanelLeftOpen className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </Button>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                  collapsed && 'justify-center px-2',
                )
              }
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              {!collapsed ? <span>{item.label}</span> : null}
              {!collapsed ? (
                <span className="sr-only">{item.label}</span>
              ) : (
                <span className="sr-only">{item.label}</span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {!collapsed && user ? (
        <div className="border-t border-sidebar-border p-4">
          <p className="truncate text-sm font-medium">{user.name}</p>
          <p className="truncate text-xs text-sidebar-foreground/70">
            {user.email}
          </p>
          <Badge variant="secondary" className="mt-2 capitalize">
            {user.role.replace('_', ' ')}
          </Badge>
        </div>
      ) : null}
    </aside>
  );
}
