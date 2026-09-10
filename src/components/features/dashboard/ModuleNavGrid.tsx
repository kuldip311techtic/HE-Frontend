import { Building2, CreditCard, UserCheck, Users, type LucideIcon } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ModuleLink {
  label: string;
  description: string;
  to: string;
  icon: LucideIcon;
}

const moduleLinks: ModuleLink[] = [
  {
    label: 'Organizations',
    description: 'Manage organization accounts and settings.',
    to: '/admin/organizations',
    icon: Building2,
  },
  {
    label: 'Coaches',
    description: 'View and manage coach accounts.',
    to: '/admin/users',
    icon: UserCheck,
  },
  {
    label: 'Players',
    description: 'View and manage player accounts.',
    to: '/admin/users',
    icon: Users,
  },
  {
    label: 'Subscriptions',
    description: 'Manage subscription plans for organizations.',
    to: '/admin/subscriptions',
    icon: CreditCard,
  },
];

export function ModuleNavGrid() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Core Modules</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {moduleLinks.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                  isActive && 'ring-2 ring-primary ring-offset-2',
                )
              }
            >
              <Card className="h-full transition-colors hover:bg-muted/50">
                <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-2">
                  <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                  <CardTitle className="text-base font-semibold">{item.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}
