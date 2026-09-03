import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils/cn';
import { SIDEBAR_NAV_ITEMS, isAdminRouteImplemented } from '@/lib/navigation/admin-routes';

interface AdminSidebarProps {
  id?: string;
  className?: string;
  onNavigate?: () => void;
}

export function AdminSidebar({ id, className, onNavigate }: AdminSidebarProps) {
  return (
    <aside
      id={id}
      className={cn(
        'flex h-full w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground',
        className,
      )}
    >
      <div className="border-b border-sidebar-border px-6 py-5">
        <p className="font-outfit text-body-25 text-foreground">Hoops Engine</p>
        <p className="font-outfit text-body-sm text-muted-foreground">Admin Panel</p>
      </div>
      <nav aria-label="Admin navigation" className="flex-1 space-y-1 px-3 py-4">
        {SIDEBAR_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isImplemented = isAdminRouteImplemented(item.targetPath);

          if (!isImplemented) {
            return (
              <span
                key={item.label}
                aria-disabled="true"
                className="flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2 font-outfit text-body-sm text-muted-foreground opacity-50"
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                {item.label}
              </span>
            );
          }

          return (
            <NavLink
              key={item.label}
              to={item.targetPath}
              end={item.targetPath === '/admin'}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 font-outfit text-body-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  isActive
                    ? 'bg-sidebar-accent/15 text-sidebar-accent'
                    : 'text-sidebar-foreground hover:bg-muted/50 active:bg-muted/70',
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
  );
}
