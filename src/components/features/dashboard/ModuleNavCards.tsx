import { Building2, CreditCard, MessageSquare, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const MODULE_LINKS = [
  {
    title: 'Organizations',
    description: 'Manage organization accounts and contact details.',
    to: '/admin/organizations',
    icon: Building2,
  },
  {
    title: 'Users',
    description: 'Manage coaches, players, and admin user accounts.',
    to: '/admin/users',
    icon: Users,
  },
  {
    title: 'Subscriptions',
    description: 'Configure subscription plans for org admins and coaches.',
    to: '/admin/subscriptions',
    icon: CreditCard,
  },
  {
    title: 'Support Requests',
    description: 'Review platform support inquiries (read-only).',
    to: '/admin/support-requests',
    icon: MessageSquare,
  },
] as const;

export function ModuleNavCards() {
  return (
    <section aria-labelledby="module-nav-heading" className="space-y-4">
      <div>
        <h2 id="module-nav-heading" className="font-outfit text-body-10">
          Core modules
        </h2>
        <p className="mt-1 text-body-sm text-muted-foreground">
          Jump to Super Admin management areas.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {MODULE_LINKS.map((module) => (
          <Link
            key={module.to}
            to={module.to}
            className={cn(
              'group block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            )}
          >
            <Card className="h-full transition-colors hover:bg-accent/50 group-focus-visible:bg-accent/50">
              <CardHeader className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <module.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <CardTitle className="font-outfit text-body-10">{module.title}</CardTitle>
                </div>
                <CardDescription className="text-body-sm">{module.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
