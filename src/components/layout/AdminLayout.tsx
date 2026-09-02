import { useState, type ReactNode } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

const pageTitles: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/organization": "Organization",
  "/admin/teams": "Teams",
  "/admin/settings": "Settings",
};

interface AdminLayoutProps {
  children?: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const title =
    pageTitles[location.pathname] ??
    Object.entries(pageTitles).find(([path]) =>
      location.pathname.startsWith(path),
    )?.[1] ??
    "Admin Panel";

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-1 flex-col min-w-0">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          title={title}
        />

        <main
          id="main-content"
          aria-labelledby="page-heading"
          className="flex-1 w-full min-w-0 overflow-y-auto px-6 py-4 scrollbar-thin"
        >
          {children ?? <Outlet />}
        </main>
      </div>
    </div>
  );
}
