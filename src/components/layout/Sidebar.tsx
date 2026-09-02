import { NavLink } from "react-router-dom";
import {
  Building2,
  CreditCard,
  HeadphonesIcon,
  LayoutDashboard,
  Settings,
  Users,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  superAdminOnly?: boolean;
  orgAdminOnly?: boolean;
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Organizations",
    href: "/admin/organization",
    icon: Building2,
    superAdminOnly: true,
  },
  {
    label: "Users",
    href: "/admin/users",
    icon: Users,
    superAdminOnly: true,
  },
  {
    label: "Subscriptions",
    href: "/admin/subscriptions",
    icon: CreditCard,
    superAdminOnly: true,
  },
  {
    label: "Support Requests",
    href: "/admin/support-requests",
    icon: HeadphonesIcon,
    superAdminOnly: true,
  },
  {
    label: "Organization",
    href: "/admin/organization",
    icon: Building2,
    orgAdminOnly: true,
  },
  {
    label: "Teams",
    href: "/admin/teams",
    icon: Users,
    orgAdminOnly: true,
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user } = useAuth();

  const isSuperAdmin =
    user?.role === "super_admin" || user?.roles.includes("super_admin");

  const visibleItems = navItems.filter((item) => {
    if (item.superAdminOnly && !isSuperAdmin) return false;
    if (item.orgAdminOnly && isSuperAdmin) return false;
    return true;
  });

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-sidebar-border bg-sidebar transition-transform duration-200 lg:static lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
        aria-label="Admin navigation"
      >
        <div className="flex h-14 items-center justify-between border-b border-sidebar-border px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
              <span className="text-sm font-bold text-primary">HE</span>
            </div>
            <span className="text-sm font-semibold text-sidebar-foreground">
              Hoops Engine
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onClose}
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4 scrollbar-thin">
          {visibleItems.map((item) => (
            <NavLink
              key={item.href + item.label}
              to={item.href}
              end={item.href === "/admin"}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/15 text-primary"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-border/50 hover:text-sidebar-foreground",
                )
              }
            >
              <item.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-sidebar-border p-4">
          <p className="truncate text-xs text-muted-foreground">Signed in as</p>
          <p className="truncate text-sm font-medium text-sidebar-foreground">
            {user?.firstName} {user?.lastName}
          </p>
          <p className="truncate text-xs capitalize text-primary">
            {user?.role.replace(/_/g, " ")}
          </p>
        </div>
      </aside>
    </>
  );
}
