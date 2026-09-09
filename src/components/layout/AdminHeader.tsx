import * as React from 'react';
import { Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/lib/auth/useAuth';
import { Badge } from '@/components/ui/badge';

interface AdminHeaderProps {
  onMenuClick?: () => void;
  menuTriggerRef?: React.RefObject<HTMLButtonElement>;
  mobileMenuOpen?: boolean;
}

export function AdminHeader({ onMenuClick, menuTriggerRef, mobileMenuOpen }: AdminHeaderProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const displayName = user
    ? `${user.first_name} ${user.last_name}`.trim() || user.email
    : 'Admin';
  const initials = displayName
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleSignOut = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <header className="flex h-14 items-center justify-between border-b border-sidebar-border bg-background px-4 md:px-6">
      <div className="flex items-center gap-3">
        <Button
          ref={menuTriggerRef}
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
          aria-expanded={mobileMenuOpen ?? false}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <span className="hidden font-outfit text-base font-semibold text-foreground sm:inline">
          Admin Console
        </span>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-figma-10 px-2 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-figma-brand"
            aria-label={`Open account menu for ${displayName}`}
          >
            <Avatar className="h-8 w-8" aria-hidden>
              <AvatarFallback aria-hidden>{initials}</AvatarFallback>
            </Avatar>
            <span
              aria-hidden
              className="hidden max-w-[10rem] truncate text-body-sm text-foreground sm:inline"
            >
              {displayName}
            </span>
            {user?.role ? (
              <Badge variant="outline" className="hidden capitalize sm:inline-flex" aria-hidden>
                {user.role.replace('_', ' ')}
              </Badge>
            ) : null}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col gap-1">
              <span>{displayName}</span>
              <span className="text-xs font-normal text-muted-foreground">{user?.email}</span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut}>Sign out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
