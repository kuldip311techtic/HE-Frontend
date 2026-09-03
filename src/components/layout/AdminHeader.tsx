import { Menu, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getRoleLabel } from '@/lib/auth/roles';
import { useAdminAuth } from '@/lib/auth/AdminAuthProvider';

interface AdminHeaderProps {
  isMobileNavOpen: boolean;
  onToggleMobileNav: () => void;
  onSignOut: () => void;
}

export function AdminHeader({ isMobileNavOpen, onToggleMobileNav, onSignOut }: AdminHeaderProps) {
  const { user } = useAdminAuth();

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-transparent px-4 md:px-6">
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onToggleMobileNav}
          aria-expanded={isMobileNavOpen}
          aria-controls="admin-mobile-nav"
          aria-label={isMobileNavOpen ? 'Close navigation menu' : 'Open navigation menu'}
        >
          {isMobileNavOpen ? (
            <X className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Menu className="h-5 w-5" aria-hidden="true" />
          )}
        </Button>
        <h1 className="font-outfit text-body-25 text-foreground">Hoops Engine Admin</h1>
      </div>
      <div className="flex items-center gap-3">
        {user ? (
          <Badge variant="secondary" className="hidden sm:inline-flex">
            {getRoleLabel(user)}
          </Badge>
        ) : null}
        <Button type="button" variant="outline" size="sm" onClick={onSignOut}>
          Sign out
        </Button>
      </div>
    </header>
  );
}
