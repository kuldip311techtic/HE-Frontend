import { Link, Navigate, useLocation } from 'react-router-dom';
import { getAuthUser } from '@/services/api-client';
import { logoutSuperAdmin } from '@/services/auth';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/super-admin/dashboard' },
  { label: 'Manage Users', href: '/super-admin/manage-users' },
] as const;

interface SuperAdminLayoutProps {
  children: React.ReactNode;
}

export function SuperAdminLayout({ children }: SuperAdminLayoutProps) {
  const user = getAuthUser();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/super-admin/login" replace state={{ from: location.pathname }} />;
  }

  function handleLogout() {
    logoutSuperAdmin();
    window.location.href = '/super-admin/login';
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">
              Hoops Engine
            </p>
            <p className="text-sm text-muted-foreground">Super Admin</p>
          </div>
          <nav aria-label="Super admin navigation" className="flex flex-wrap items-center gap-2">
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    'inline-flex min-h-[44px] items-center rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    isActive
                      ? 'bg-primary/15 text-primary'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
            <Button variant="outline" size="sm" onClick={handleLogout} className="ml-2">
              Sign out
            </Button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
