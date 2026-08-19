import { useNavigate } from 'react-router-dom';
import { clearAuth } from '../../hooks/useAuth';
import { paths } from '../../routes/paths';
import { authStore } from '../../stores/authStore';
import Button from '../ui/Button';

interface HeaderProps {
  title: string;
  onMenuToggle: () => void;
  menuOpen: boolean;
}

export default function Header({ title, onMenuToggle, menuOpen }: HeaderProps) {
  const navigate = useNavigate();
  const email = authStore.getEmail();

  const handleSignOut = () => {
    clearAuth();
    navigate(paths.login, { replace: true });
  };

  return (
    <header className="flex min-h-16 items-center justify-between gap-4 border-b border-white/10 bg-primary px-4 py-3 text-secondary sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-secondary transition hover:bg-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent lg:hidden"
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
        <div className="w-[120px]">
          <Button type="button" variant="accent" onClick={handleSignOut}>
            Sign out
          </Button>
        </div>
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
