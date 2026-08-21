import { useState, type ReactNode } from 'react';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';

interface AdminLayoutProps {
  title: string;
  children: ReactNode;
}

export default function AdminLayout({ title, children }: AdminLayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-canvas lg:flex">
      <AdminSidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <AdminHeader
          title={title}
          menuOpen={menuOpen}
          onMenuToggle={() => setMenuOpen((open) => !open)}
        />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
