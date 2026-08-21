import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";

interface AdminHeaderProps {
  onMenuClick: () => void;
  menuOpen: boolean;
}

export function AdminHeader({ onMenuClick, menuOpen }: AdminHeaderProps) {
  const { session, logout } = useAuth();

  return (
    <header className="flex h-header items-center justify-between border-b border-border bg-surface px-4 md:px-6">
      <div className="flex items-center gap-3">
        <Button
          variant="secondary"
          className="md:hidden"
          onClick={onMenuClick}
          aria-expanded={menuOpen}
          aria-controls="admin-sidebar"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
        >
          Menu
        </Button>
        <h1 className="text-lg font-semibold text-foreground">Dashboard</h1>
      </div>
      <div className="flex items-center gap-3">
        <p className="hidden text-sm text-muted sm:block">{session?.email}</p>
        <Button variant="secondary" onClick={logout}>
          Sign out
        </Button>
      </div>
    </header>
  );
}
