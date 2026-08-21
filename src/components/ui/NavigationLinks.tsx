import { NavLink } from 'react-router-dom';
import { adminCoreModules } from '../../routes/admin';

export default function NavigationLinks() {
  return (
    <section
      aria-label="Core module navigation"
      className="rounded-2xl border border-line bg-surface p-6 shadow-card sm:p-8"
    >
      <div className="mb-5">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent">
          Navigation
        </p>
        <h2 className="mt-1 text-2xl font-bold leading-8 text-ink">
          Core modules
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
          Jump directly to organizations, coaches, players, sessions, and
          subscription management.
        </p>
      </div>

      <nav aria-label="Core modules">
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {adminCoreModules.map((module) => (
            <li key={module.to}>
              <NavLink
                to={module.to}
                className={({ isActive }) =>
                  `flex min-h-touch flex-col justify-center rounded-xl border px-4 py-4 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                    isActive
                      ? 'border-accent bg-accent-soft text-ink'
                      : 'border-line bg-canvas text-ink hover:border-accent hover:bg-accent-soft active:bg-accent-soft'
                  }`
                }
              >
                <span className="text-sm font-semibold leading-5">
                  {module.label}
                </span>
                <span className="mt-1 text-xs leading-4 text-muted">
                  {module.description}
                </span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}
