import { LayoutDashboard } from 'lucide-react';
import { NavLink } from 'react-router-dom';

import { cn } from '@/lib/utils';

const navItems = [
  {
    label: 'Dashboard',
    to: '/admin',
    icon: LayoutDashboard,
  },
];

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <aside className="flex h-full w-64 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="border-b border-sidebar-border px-6 py-5">
        <p className="font-outfit text-body-25">Hoops Engine</p>
        <p className="text-body-sm text-sidebar-foreground/80">Admin Panel</p>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4" aria-label="Admin navigation">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-body-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-sidebar-foreground/80 hover:bg-sidebar-border/50 hover:text-sidebar-foreground',
              )
            }
          >
            <item.icon className="h-4 w-4" aria-hidden="true" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
