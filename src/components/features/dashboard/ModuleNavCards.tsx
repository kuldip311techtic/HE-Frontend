import { NavLink } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  MODULE_NAV_CARDS,
  getModuleNavHref,
  isAdminRouteImplemented,
} from '@/lib/navigation/admin-routes';

export function ModuleNavCards() {
  return (
    <section aria-labelledby="platform-modules-heading">
      <h3 id="platform-modules-heading" className="dashboard-section-title">
        Platform modules
      </h3>
      <div className="dashboard-module-grid">
        {MODULE_NAV_CARDS.map(({ title, description, targetPath, icon: Icon }) => {
          const href = getModuleNavHref(targetPath);
          const isAvailable = isAdminRouteImplemented(targetPath);

          return (
            <Card
              key={title}
              className={`dashboard-module-card${isAvailable ? '' : ' opacity-80'}`}
            >
              <CardHeader>
                <div className="mb-2 flex items-start justify-between gap-2">
                  <div className="dashboard-module-card__icon-wrap">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <Badge variant={isAvailable ? 'outline' : 'secondary'}>
                    {isAvailable ? 'Available' : 'Coming soon'}
                  </Badge>
                </div>
                <CardTitle className="dashboard-module-card__title">{title}</CardTitle>
                <CardDescription className="dashboard-module-card__description">
                  {description}
                </CardDescription>
              </CardHeader>
              {href ? (
                <CardContent>
                  <Button asChild variant="outline" size="sm" className="admin-outline-btn">
                    <NavLink
                      to={href}
                      className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      aria-label={`Open ${title} module`}
                    >
                      Open module
                    </NavLink>
                  </Button>
                </CardContent>
              ) : null}
            </Card>
          );
        })}
      </div>
    </section>
  );
}
