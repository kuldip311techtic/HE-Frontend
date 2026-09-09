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
      <h3 id="platform-modules-heading" className="mb-4 font-outfit text-body-25 text-white">
        Platform modules
      </h3>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {MODULE_NAV_CARDS.map(({ title, description, targetPath, searchParams, icon: Icon }) => {
          const href = getModuleNavHref(targetPath, searchParams);
          const isAvailable = isAdminRouteImplemented(targetPath);

          return (
            <Card
              key={title}
              className={
                isAvailable
                  ? 'admin-module-card transition-colors focus-within:ring-2 focus-within:ring-figma-brand'
                  : 'admin-module-card opacity-80'
              }
            >
              <CardHeader className="gap-figma-10 p-5">
                <div className="flex items-start justify-between gap-figma-12">
                  <div className="admin-module-card__icon">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <Badge
                    variant={isAvailable ? 'outline' : 'secondary'}
                    className={
                      isAvailable
                        ? 'border-figma-border bg-[var(--token-color-107)] text-[var(--token-color-114)]'
                        : 'border-figma-border bg-[var(--token-color-103)] text-figma-accent'
                    }
                  >
                    {isAvailable ? 'Available' : 'Coming soon'}
                  </Badge>
                </div>
                <CardTitle className="font-outfit text-body-25 text-white">{title}</CardTitle>
                <CardDescription className="font-lato text-body-5 text-figma-accent">
                  {description}
                </CardDescription>
              </CardHeader>
              {href ? (
                <CardContent className="p-5 pt-0">
                  <Button asChild variant="outline" size="sm" className="admin-outline-btn">
                    <NavLink
                      to={href}
                      className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-figma-brand"
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
