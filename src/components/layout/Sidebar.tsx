import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-card/95 backdrop-blur-sm transition-transform duration-200 md:static md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
        aria-label="Admin navigation"
      >
        <div className="flex h-14 items-center justify-between border-b border-border px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
              <span className="text-sm font-bold text-primary" aria-hidden="true">
                HE
              </span>
            </div>
            <span className="text-sm font-semibold text-foreground">Hoops Engine</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onClose}
            aria-label="Close navigation menu"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4" role="navigation">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  isActive
                    ? 'bg-primary/20 text-primary'
                    : 'text-muted-foreground hover:bg-accent/30 hover:text-foreground',
                )
              }
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-border px-4 py-3">
          <p className="text-xs text-muted-foreground">Super Admin Panel</p>
        </div>
      </aside>
    </>
  );
}

export function SidebarToggle({
  onOpen,
}: {
  onOpen: () => void;
}) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="md:hidden"
      onClick={onOpen}
      aria-label="Open navigation menu"
    >
      <Menu className="h-5 w-5" />
    </Button>
  );
}
