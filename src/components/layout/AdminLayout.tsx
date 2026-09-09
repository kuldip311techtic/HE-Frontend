import * as React from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { AdminHeader } from '@/components/layout/AdminHeader';
import { cn } from '@/lib/utils/cn';

export function AdminLayout() {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="lg:flex">
        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-40 w-64 -translate-x-full border-r border-sidebar-border bg-sidebar transition-transform lg:translate-x-0',
            mobileOpen && 'translate-x-0',
          )}
        >
          <AdminSidebar onNavigate={() => setMobileOpen(false)} />
        </aside>

        {mobileOpen ? (
          <button
            type="button"
            className="fixed inset-0 z-30 bg-black/60 lg:hidden"
            aria-label="Close navigation menu"
            onClick={() => setMobileOpen(false)}
          />
        ) : null}

        <div className="flex min-h-screen flex-1 flex-col lg:pl-64">
          <AdminHeader onMenuClick={() => setMobileOpen(true)} />
          <main className="flex-1 px-4 py-6 md:px-6 md:py-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
