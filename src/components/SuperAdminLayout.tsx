import {
  Building2,
  CreditCard,
  HeadphonesIcon,
  LayoutDashboard,
  LogOut,
  Menu,
  UserCog,
  Users,
  UsersRound,
  X,
} from "lucide-react";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { clearAuthToken } from "@/services/api-client";
import { cn } from "@/lib/utils";

interface SuperAdminLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  {
    to: "/super-admin/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    to: "/super-admin/organizations",
    label: "Organizations",
    icon: Building2,
  },
  {
    to: "/super-admin/users",
    label: "Users",
    icon: UsersRound,
  },
  {
    to: "/super-admin/coaches",
    label: "Coaches",
    icon: UserCog,
  },
  {
    to: "/super-admin/players",
    label: "Players",
    icon: Users,
  },
  {
    to: "/super-admin/subscriptions",
    label: "Subscriptions",
    icon: CreditCard,
  },
  {
    to: "/super-admin/support-requests",
    label: "Support",
    icon: HeadphonesIcon,
  },
];

export function SuperAdminLayout({ children }: SuperAdminLayoutProps) {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    clearAuthToken();
    navigate("/super-admin/login", { replace: true });
  };

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <aside className="hidden w-56 shrink-0 flex-col border-r border-border bg-card/50 md:flex">
        <div className="flex h-14 items-center border-b border-border px-4">
          <span className="text-lg font-semibold text-primary">Hoops Engine</span>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-3" aria-label="Super Admin">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isActive
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )
              }
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-border p-3">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
            onClick={handleLogout}
            aria-label="Log out"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Log out
          </Button>
        </div>
      </aside>

      {/* Mobile header + drawer */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b border-border bg-card/50 px-4 md:hidden">
          <span className="text-base font-semibold text-primary">Hoops Engine</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </Button>
        </header>

        {mobileOpen && (
          <nav
            className="border-b border-border bg-card/95 p-3 md:hidden"
            aria-label="Super Admin mobile"
          >
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/15 text-primary"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  )
                }
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                {label}
              </NavLink>
            ))}
            <Button
              variant="ghost"
              className="mt-2 w-full justify-start gap-3 py-3 text-muted-foreground"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Log out
            </Button>
          </nav>
        )}

        <main className="flex-1 px-4 py-4 sm:px-6 sm:py-6">{children}</main>
      </div>
    </div>
  );
}
