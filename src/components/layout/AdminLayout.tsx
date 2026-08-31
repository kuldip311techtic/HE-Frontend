import { useState } from 'react';
import { Outlet, useMatches } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';

interface RouteHandle {
  title?: string;
}

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const matches = useMatches();

  const title =
    [...matches]
      .reverse()
      .map((match) => (match.handle as RouteHandle | undefined)?.title)
      .find(Boolean) ?? 'Dashboard';

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          title={title}
          onMenuOpen={() => setSidebarOpen(true)}
        />
        <main
          id="main-content"
          className="flex-1 overflow-auto p-4 lg:p-6"
          tabIndex={-1}
        >
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
