import { Building2, LayoutDashboard, Users } from "lucide-react";
import { NavLink } from "react-router-dom";

import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "Dashboard",
    to: "/super-admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Organizations",
    to: "/super-admin/manage-organizations",
    icon: Building2,
  },
  {
    label: "Users",
    to: "/super-admin/manage-users",
    icon: Users,
  },
] as const;

export function Sidebar() {
  return (
    <aside
      className="hidden w-64 shrink-0 border-r bg-card md:flex md:flex-col"
      aria-label="Admin navigation"
    >
      <div className="flex h-16 items-center border-b px-6">
        <span className="text-lg font-semibold tracking-tight">
          Hoops Engine
        </span>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-4">
        {navItems.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )
            }
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
