import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const navItems = [
  {
    to: '/admin',
    label: 'Dashboard',
    icon: LayoutDashboard,
    end: true,
  },
] as const;

export function Sidebar({ collapsed, onToggleCollapse }: SidebarProps) {
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
          <span className="text-lg font-semibold tracking-tight">HE Admin</span>
        ) : (
          <span className="sr-only">HE Admin</span>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <PanelLeftOpen className="h-5 w-5" />
          ) : (
            <PanelLeftClose className="h-5 w-5" />
          )}
        </Button>
      </div>

      <nav className="flex-1 space-y-1 p-2">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground',
                collapsed && 'justify-center px-2',
              )
            }
          >
            <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
            {!collapsed ? <span>{label}</span> : <span className="sr-only">{label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
