import { NavLink } from 'react-router-dom';
import { adminNavigation } from '../../routes/admin';
import BrandMark from './BrandMark';

interface AdminSidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  return (
    <>
      {open ? (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-30 bg-overlay lg:hidden"
          onClick={onClose}
        />
      ) : null}

      <aside
        id="admin-sidebar"
        aria-label="Admin navigation"
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-primary px-5 py-6 text-secondary shadow-card transition-transform lg:static lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <BrandMark />
        <nav className="mt-10 flex flex-col gap-2" aria-label="Primary">
          {adminNavigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex min-h-touch items-center rounded-xl px-4 py-3 text-sm font-semibold leading-5 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                  isActive
                    ? 'bg-accent text-secondary'
                    : 'text-navy-muted hover:bg-navy hover:text-secondary'
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
