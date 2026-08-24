import { LogOut, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { clearStoredToken } from "@/lib/utils";

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearStoredToken();
    navigate("/super-admin/login", { replace: true });
  };

  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-sm font-medium text-muted-foreground sm:text-base">
          Super Admin Portal
        </h1>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={handleLogout}
        aria-label="Sign out"
      >
        <LogOut className="h-4 w-4" aria-hidden="true" />
        <span className="hidden sm:inline">Sign out</span>
      </Button>
    </header>
  );
}
