import { useState, type ReactNode } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AdminContractProbes } from "@/components/layout/AdminContractProbes";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

const pageTitles: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/dashboard": "Dashboard",
  "/admin/organizations": "Organizations",
  "/admin/users": "Users",
  "/admin/subscriptions": "Subscriptions",
  "/admin/support-requests": "Support Requests",
};

interface AdminLayoutProps {
  children?: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const title = pageTitles[location.pathname] ?? "Admin Panel";

  return (
    <div className="flex min-h-screen bg-background">
      <AdminContractProbes />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          title={title}
        />

        <main
          id="main-content"
          aria-labelledby="page-heading"
          className="scrollbar-thin w-full min-w-0 flex-1 overflow-y-auto px-6 py-4"
        >
          {children ?? <Outlet />}
        </main>
      </div>
    </div>
  );
}
