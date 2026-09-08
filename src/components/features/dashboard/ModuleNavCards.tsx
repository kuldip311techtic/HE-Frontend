import { NavLink } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import {
  MODULE_NAV_CARDS,
  getModuleNavHref,
  isAdminRouteImplemented,
} from '@/lib/navigation/admin-routes';
import { cn } from '@/lib/utils/cn';

export function ModuleNavCards() {
  return (
    <section className="admin-dashboard-modules" aria-labelledby="platform-modules-heading">
      <h3 id="platform-modules-heading" className="admin-dashboard-modules__heading">
        Platform modules
      </h3>
      <div className="admin-dashboard-modules__grid">
        {MODULE_NAV_CARDS.map(({ title, description, targetPath, icon: Icon }) => {
          const href = getModuleNavHref(targetPath);
          const isAvailable = isAdminRouteImplemented(targetPath);

          return (
            <Card
              key={title}
              className={cn(
                'admin-dashboard-module-card focus-within:ring-2 focus-within:ring-ring',
                !isAvailable && 'admin-dashboard-module-card--disabled',
              )}
            >
              <div className="admin-dashboard-module-card__header">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <div className="admin-dashboard-module-card__icon">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <span
                    className={cn(
                      'admin-dashboard-module-card__badge',
                      isAvailable
                        ? 'admin-dashboard-module-card__badge--available'
                        : 'admin-dashboard-module-card__badge--soon',
                    )}
                  >
                    {isAvailable ? 'Available' : 'Coming soon'}
                  </span>
                </div>
                <h4>{title}</h4>
                <p>{description}</p>
              </div>
              {href ? (
                <div className="admin-dashboard-module-card__content">
                  <NavLink
                    to={href}
                    className="admin-dashboard-module-card__open focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    Open module
                  </NavLink>
                </div>
              ) : null}
            </Card>
          );
        })}
      </div>
    </section>
  );
}
