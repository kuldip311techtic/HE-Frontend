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
                  ? 'admin-module-card transition-colors focus-within:ring-2 focus-within:ring-[#86d31f]'
                  : 'admin-module-card opacity-80'
              }
            >
              <CardHeader className="gap-[10px] p-5">
                <div className="flex items-start justify-between gap-[12px]">
                  <div className="admin-module-card__icon">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <Badge
                    variant={isAvailable ? 'outline' : 'secondary'}
                    className={
                      isAvailable
                        ? 'border-[#0d1612] bg-[#1bc94f1f] text-[#4bcd39]'
                        : 'border-[#0d1612] bg-[#c0c0c033] text-[#445154]'
                    }
                  >
                    {isAvailable ? 'Available' : 'Coming soon'}
                  </Badge>
                </div>
                <CardTitle className="font-outfit text-body-25 text-white">{title}</CardTitle>
                <CardDescription className="font-lato text-body-5 text-[#445154]">
                  {description}
                </CardDescription>
              </CardHeader>
              {href ? (
                <CardContent className="p-5 pt-0">
                  <Button asChild variant="outline" size="sm" className="admin-outline-btn">
                    <NavLink
                      to={href}
                      className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#86d31f]"
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
