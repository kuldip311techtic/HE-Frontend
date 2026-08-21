import { Link } from "react-router-dom";

import { CORE_MODULE_LINKS } from "@/lib/coreModules";

interface NavigationLinksProps {
  onNavigate?: () => void;
}

export function NavigationLinks({ onNavigate }: NavigationLinksProps) {
  return (
    <nav aria-label="Core modules">
      <h2 className="text-lg font-semibold text-foreground">Core modules</h2>
      <p className="mt-1 text-sm text-muted">
        Open a module to review its dashboard metric.
      </p>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {CORE_MODULE_LINKS.map((item) => (
          <li key={item.id}>
            <Link
              to={item.to}
              onClick={onNavigate}
              className="flex min-h-touch flex-col justify-center rounded-lg border border-border bg-surface px-4 py-3 shadow-sm transition-colors hover:border-primary hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-focus focus-visible:ring-offset-2"
            >
              <span className="text-sm font-semibold text-foreground">
                {item.label}
              </span>
              <span className="mt-1 text-sm text-muted">
                {item.description}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
