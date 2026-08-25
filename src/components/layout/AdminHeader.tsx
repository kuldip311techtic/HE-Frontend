import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { clearAuth, getStoredEmail } from '@/lib/auth/session';
import { paths } from '@/routes/paths';

interface AdminHeaderProps {
  title: string;
  onMenuToggle: () => void;
  menuOpen: boolean;
}

export default function AdminHeader({
  title,
  onMenuToggle,
  menuOpen,
}: AdminHeaderProps) {
  const navigate = useNavigate();
  const email = getStoredEmail();

  const handleSignOut = () => {
    clearAuth();
    navigate(paths.login, { replace: true });
  };

  return (
    <header className="flex min-h-16 items-center justify-between gap-4 border-b border-white/10 bg-primary px-4 py-3 text-primary-foreground sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-xl transition hover:bg-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent lg:hidden"
          aria-label={
            menuOpen ? 'Close navigation menu' : 'Open navigation menu'
          }
          aria-expanded={menuOpen}
          aria-controls="admin-sidebar"
          onClick={onMenuToggle}
        >
          <MenuIcon />
        </button>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
            Super Admin
          </p>
          <h1 className="truncate text-lg font-bold leading-6 sm:text-xl">
            {title}
          </h1>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        {email ? (
          <p className="hidden max-w-[220px] truncate text-sm text-navy-muted md:block">
            {email}
          </p>
        ) : null}
        <Button type="button" variant="secondary" onClick={handleSignOut}>
          Sign out
        </Button>
      </div>
    </header>
  );
}

function MenuIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}
