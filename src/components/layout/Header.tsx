import { Menu } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { getRoleLabel } from '@/types/auth';

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:px-6">
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
          aria-expanded={Boolean(onMenuClick)}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div>
          <p className="font-outfit text-body-10">Hoops Engine Admin</p>
          <p className="hidden text-body-sm text-muted-foreground md:block">
            Super Admin workspace
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {user ? (
          <Badge variant="default" aria-label={`Signed in as ${getRoleLabel(user.role)}`}>
            {getRoleLabel(user.role)}
          </Badge>
        ) : null}
        <Button type="button" variant="outline" size="sm" onClick={logout}>
          Sign out
        </Button>
      </div>
    </header>
  );
}
