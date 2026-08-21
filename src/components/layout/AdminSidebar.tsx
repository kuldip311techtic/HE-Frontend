import { NavLink } from "react-router-dom";

import { CORE_MODULE_LINKS } from "@/lib/coreModules";
import { useAuth } from "@/hooks/useAuth";

interface NavItem {
  to: string;
  label: string;
  end?: boolean;
  roles: Array<"admin" | "super_admin">;
}

const NAV_ITEMS: NavItem[] = [
  {
    to: "/admin/dashboard",
    label: "Dashboard",
    end: true,
    roles: ["admin", "super_admin"],
  },
  ...CORE_MODULE_LINKS.map((item) => ({
    to: item.to,
    label: item.label,
    roles: ["admin", "super_admin"] as Array<"admin" | "super_admin">,
  })),
];

interface AdminSidebarProps {
  open: boolean;
  onClose: () => void;
}

export function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  const { session, isSuperAdmin } = useAuth();
  const role = session?.role;

  const items = NAV_ITEMS.filter(
    (item) =>
      role !== undefined && item.roles.some((allowed) => allowed === role),
  );

  return (
    <>
      <div
        className={`fixed inset-0 z-20 bg-sidebar/50 transition-opacity md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={`fixed inset-y-0 left-0 z-30 flex w-sidebar transform flex-col bg-sidebar text-sidebar-text transition-transform md:static md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Admin navigation"
      >
        <div className="flex h-header items-center border-b border-sidebar-active px-6">
          <p className="text-lg font-semibold">
            {isSuperAdmin ? "Super Admin" : "Admin"}
          </p>
        </div>
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex min-h-touch items-center rounded-md px-3 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-focus ${
                  isActive && item.end
                    ? "bg-sidebar-active text-white"
                    : "text-sidebar-muted hover:bg-sidebar-active hover:text-sidebar-text"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
