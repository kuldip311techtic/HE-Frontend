import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import { AdminHeader } from "@/components/layout/AdminHeader";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { AdminErrorBoundary } from "@/components/ui/AdminErrorBoundary";

export function AdminLayout() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="flex min-h-screen bg-background">
      <div id="admin-sidebar">
        <AdminSidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminHeader
          menuOpen={menuOpen}
          onMenuClick={() => setMenuOpen((open) => !open)}
        />
        <main className="flex-1 px-4 py-6 md:px-6">
          <AdminErrorBoundary>
            <Outlet />
          </AdminErrorBoundary>
        </main>
      </div>
    </div>
  );
}
