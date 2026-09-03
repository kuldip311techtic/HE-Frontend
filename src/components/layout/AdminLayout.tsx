import { useEffect, useRef, useState } from 'react';
import { Outlet } from 'react-router-dom';

import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { cn } from '@/lib/utils';

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const MOBILE_NAV_MEDIA_QUERY = '(max-width: 1023px)';

function isMobileNavViewport(): boolean {
  return window.matchMedia(MOBILE_NAV_MEDIA_QUERY).matches;
}

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (element) => !element.hasAttribute('disabled') && element.tabIndex !== -1,
  );
}

export function AdminLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);

  const closeMobileNav = () => setMobileNavOpen(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_NAV_MEDIA_QUERY);

    if (!mediaQuery.matches) {
      setMobileNavOpen(false);
    }

    const handleViewportChange = (event: MediaQueryListEvent) => {
      if (!event.matches) {
        setMobileNavOpen(false);
      }
    };

    mediaQuery.addEventListener('change', handleViewportChange);

    return () => {
      mediaQuery.removeEventListener('change', handleViewportChange);
    };
  }, []);

  useEffect(() => {
    if (!mobileNavOpen || !isMobileNavViewport()) {
      return;
    }

    const sidebar = sidebarRef.current;
    if (!sidebar) {
      return;
    }

    const menuButton = menuButtonRef.current;
    const focusables = getFocusableElements(sidebar);
    focusables[0]?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isMobileNavViewport()) {
        return;
      }

      if (event.key === 'Escape') {
        event.preventDefault();
        setMobileNavOpen(false);
        return;
      }

      if (event.key !== 'Tab') {
        return;
      }

      const trapFocusables = getFocusableElements(sidebar);
      if (trapFocusables.length === 0) {
        event.preventDefault();
        return;
      }

      const first = trapFocusables[0];
      const last = trapFocusables[trapFocusables.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (event.shiftKey) {
        if (active === first || !active || !sidebar.contains(active)) {
          event.preventDefault();
          last.focus();
        }
        return;
      }

      if (active === last || !active || !sidebar.contains(active)) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (isMobileNavViewport()) {
        menuButton?.focus();
      }
    };
  }, [mobileNavOpen]);

  return (
    <div className="flex min-h-screen bg-background">
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-40 transform transition-transform duration-200 lg:static lg:translate-x-0',
          mobileNavOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <Sidebar ref={sidebarRef} onNavigate={closeMobileNav} />
      </div>

      {mobileNavOpen && isMobileNavViewport() ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          aria-label="Close navigation menu"
          onClick={closeMobileNav}
          tabIndex={-1}
        />
      ) : null}

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <Header
          menuButtonRef={menuButtonRef}
          mobileNavOpen={mobileNavOpen}
          onMenuClick={() => setMobileNavOpen((open) => !open)}
        />
        <main className="flex-1 px-4 py-6 md:px-6 md:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
