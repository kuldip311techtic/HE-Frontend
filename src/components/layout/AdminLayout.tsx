import { useCallback, useEffect, useRef, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { AdminHeader } from '@/components/layout/AdminHeader';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { useAdminAuth } from '@/lib/auth/AdminAuthProvider';
import { cn } from '@/lib/utils/cn';

export function AdminLayout() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const { logout } = useAdminAuth();
  const navigate = useNavigate();
  const drawerRef = useRef<HTMLDivElement>(null);

  const closeMobileNav = useCallback(() => {
    setIsMobileNavOpen(false);
  }, []);

  const handleSignOut = useCallback(() => {
    logout();
    navigate('/admin/login', { replace: true });
  }, [logout, navigate]);

  useEffect(() => {
    if (!isMobileNavOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMobileNav();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    const drawer = drawerRef.current;
    if (!drawer) {
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
      };
    }

    const focusable = drawer.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    first?.focus();

    const handleTab = (event: KeyboardEvent) => {
      if (event.key !== 'Tab' || focusable.length === 0) return;
      if (event.shiftKey) {
        if (document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        }
      } else if (document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };

    document.addEventListener('keydown', handleTab);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keydown', handleTab);
      document.body.style.overflow = '';
    };
  }, [isMobileNavOpen, closeMobileNav]);

  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden lg:block">
        <AdminSidebar className="fixed inset-y-0 left-0 z-30" />
      </div>

      {isMobileNavOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          aria-label="Close navigation menu"
          onClick={closeMobileNav}
        />
      ) : null}

      <div
        ref={drawerRef}
        id="admin-mobile-nav"
        className={cn(
          'fixed inset-y-0 left-0 z-50 transform transition-transform duration-200 lg:hidden',
          isMobileNavOpen ? 'translate-x-0' : '-translate-x-full',
        )}
        aria-hidden={!isMobileNavOpen}
        {...(!isMobileNavOpen ? { inert: '' } : {})}
      >
        <AdminSidebar onNavigate={closeMobileNav} />
      </div>

      <div className="flex min-h-screen flex-1 flex-col lg:pl-64">
        <AdminHeader
          isMobileNavOpen={isMobileNavOpen}
          onToggleMobileNav={() => setIsMobileNavOpen((open) => !open)}
          onSignOut={handleSignOut}
        />
        <main className="flex-1 px-4 py-6 md:px-6 md:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
