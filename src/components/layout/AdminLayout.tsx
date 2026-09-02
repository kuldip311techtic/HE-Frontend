import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '@/components/ui/Header';
import { Sidebar } from '@/components/ui/Sidebar';

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex flex-1 flex-col min-w-0">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-auto px-6 py-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
