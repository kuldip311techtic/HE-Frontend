import * as React from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { AdminHeader } from '@/components/layout/AdminHeader';
import { cn } from '@/lib/utils/cn';

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (element) => !element.hasAttribute('disabled') && element.tabIndex !== -1,
  );
}

export function AdminLayout() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const menuTriggerRef = React.useRef<HTMLButtonElement>(null);
  const drawerRef = React.useRef<HTMLElement>(null);

  const closeMobileMenu = React.useCallback(() => {
    setMobileOpen(false);
    requestAnimationFrame(() => {
      menuTriggerRef.current?.focus();
    });
  }, []);

  React.useEffect(() => {
    if (!mobileOpen) return;

    const drawer = drawerRef.current;
    if (!drawer) return;

    const focusables = getFocusableElements(drawer);
    focusables[0]?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeMobileMenu();
        return;
      }

      if (event.key !== 'Tab') return;

      const items = getFocusableElements(drawer);
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [mobileOpen, closeMobileMenu]);

  return (
    <div className="min-h-screen bg-background">
      <div className="lg:flex">
        <aside
          ref={drawerRef}
          className={cn(
            'fixed inset-y-0 left-0 z-40 w-64 -translate-x-full border-r border-sidebar-border bg-sidebar transition-transform lg:translate-x-0',
            mobileOpen && 'translate-x-0',
          )}
        >
          <AdminSidebar onNavigate={closeMobileMenu} />
        </aside>

        {mobileOpen ? (
          <button
            type="button"
            className="fixed inset-0 z-30 bg-black/60 lg:hidden"
            aria-label="Close navigation menu"
            onClick={closeMobileMenu}
          />
        ) : null}

        <div className="flex min-h-screen flex-1 flex-col lg:pl-64">
          <AdminHeader
            menuTriggerRef={menuTriggerRef}
            mobileMenuOpen={mobileOpen}
            onMenuClick={() => setMobileOpen(true)}
          />
          <main className="flex-1 px-4 py-6 md:px-6 md:py-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
