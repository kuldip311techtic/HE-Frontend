import {
  ArrowRight,
  Building2,
  CreditCard,
  UserCircle,
  Users,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { paths } from '@/routes/paths';
import type { DashboardLink } from '@/types/dashboard';

interface ModuleLink {
  label: string;
  to: string;
  description: string;
  icon: LucideIcon;
}

const DEFAULT_MODULES: ModuleLink[] = [
  {
    label: 'Organizations',
    to: paths.organizations,
    description: 'Manage organizations and their settings',
    icon: Building2,
  },
  {
    label: 'Coaches',
    to: paths.coaches,
    description: 'View and manage coaching staff',
    icon: Users,
  },
  {
    label: 'Players',
    to: paths.players,
    description: 'Browse and manage player profiles',
    icon: UserCircle,
  },
  {
    label: 'Subscriptions',
    to: paths.subscriptions,
    description: 'Configure subscription plans and pricing',
    icon: CreditCard,
  },
];

interface NavigationLinksProps {
  apiLinks?: DashboardLink[];
}

function labelFromPath(link: string): string {
  const segment = link.split('/').filter(Boolean).pop() ?? link;
  return segment
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function resolveModuleLinks(apiLinks?: DashboardLink[]): ModuleLink[] {
  if (!apiLinks?.length) {
    return DEFAULT_MODULES;
  }

  const iconByLabel: Record<string, LucideIcon> = {
    organizations: Building2,
    organization: Building2,
    coaches: Users,
    coach: Users,
    players: UserCircle,
    player: UserCircle,
    subscriptions: CreditCard,
    subscription: CreditCard,
  };

  return apiLinks.map((apiLink) => {
    const path = apiLink.link.startsWith('/') ? apiLink.link : `/${apiLink.link}`;
    const pathKey = path.split('/').filter(Boolean).pop()?.toLowerCase() ?? '';
    const matchedKey = Object.keys(iconByLabel).find((key) =>
      pathKey.includes(key),
    );
    const icon = matchedKey ? iconByLabel[matchedKey] : Building2;

    return {
      label: labelFromPath(path),
      to: path,
      description: apiLink.description,
      icon,
    };
  });
}

export default function NavigationLinks({ apiLinks }: NavigationLinksProps) {
  const modules = resolveModuleLinks(apiLinks);

  return (
    <section aria-label="Core module navigation" className="mt-8">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-foreground">Core Modules</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Navigate to platform management areas
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {modules.map((module) => {
          const Icon = module.icon;

          return (
            <Link
              key={module.to}
              to={module.to}
              className="group block min-h-touch rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              aria-label={`Navigate to ${module.label}`}
            >
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10"
                      aria-hidden="true"
                    >
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <ArrowRight
                      className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-accent"
                      aria-hidden="true"
                    />
                  </div>
                  <CardTitle className="text-base">{module.label}</CardTitle>
                  <CardDescription>{module.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <span className="text-sm font-medium text-accent group-hover:underline">
                    Open module
                  </span>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
