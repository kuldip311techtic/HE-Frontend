import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { LayoutDashboard, LogOut, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { clearAuthToken } from "@/services/api-client";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/super-admin/dashboard" as const, label: "Dashboard", icon: LayoutDashboard },
  { to: "/super-admin/manage-users" as const, label: "Users", icon: Users },
] as const;

interface AdminLayoutProps {
  children: ReactNode;
  activePath: "/super-admin/dashboard" | "/super-admin/manage-users";
}

export function AdminLayout({ children, activePath }: AdminLayoutProps) {
  const handleLogout = () => {
    clearAuthToken();
    window.location.href = "/super-admin/login";
  };

  return (
    <div className="flex min-h-screen flex-col bg-background lg:flex-row">
      <aside
        className="hidden w-64 shrink-0 flex-col border-r border-border bg-card/50 lg:flex"
        aria-label="Admin navigation"
      >
        <div className="border-b border-border px-6 py-5">
          <span className="text-lg font-semibold text-primary">Hoops Engine</span>
          <p className="text-xs text-muted-foreground">Super Admin</p>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                to === activePath
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-border p-4">
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </Button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border px-4 py-3 lg:hidden">
          <span className="font-semibold text-primary">Hoops Engine</span>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            <span className="sr-only">Log out</span>
          </Button>
        </header>

        <main className="flex-1 overflow-auto pb-20 lg:pb-0">{children}</main>

        <nav
          className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-border bg-card py-2 lg:hidden"
          aria-label="Mobile admin navigation"
        >
          {navItems.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={cn(
                "flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-0.5 px-3 text-xs font-medium transition-colors",
                to === activePath ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
