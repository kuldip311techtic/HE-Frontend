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
      <h3 id="platform-modules-heading" className="mb-4 font-outfit text-body-25 text-foreground">
        Platform modules
      </h3>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {MODULE_NAV_CARDS.map(({ title, description, targetPath, icon: Icon }) => {
          const href = getModuleNavHref(targetPath);
          const isAvailable = isAdminRouteImplemented(targetPath);

          return (
            <Card
              key={title}
              className={
                isAvailable
                  ? 'transition-colors hover:bg-muted/50 focus-within:ring-2 focus-within:ring-ring'
                  : 'opacity-80'
              }
            >
              <CardHeader>
                <div className="mb-2 flex items-start justify-between gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <Badge variant={isAvailable ? 'outline' : 'secondary'}>
                    {isAvailable ? 'Available' : 'Coming soon'}
                  </Badge>
                </div>
                <CardTitle className="text-base">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
              <CardContent>
                {href ? (
                  <Button asChild variant="outline" size="sm">
                    <NavLink
                      to={href}
                      className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      Open module
                    </NavLink>
                  </Button>
                ) : (
                  <span
                    aria-disabled="true"
                    className="font-outfit text-body-sm text-muted-foreground"
                  >
                    Coming in a future release
                  </span>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
